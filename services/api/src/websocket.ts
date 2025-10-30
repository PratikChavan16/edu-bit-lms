import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { verifyAccessToken } from './lib/auth';
import { prisma } from './lib/prisma';

export const initializeWebSocket = (httpServer: HttpServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const payload = verifyAccessToken(token);
      if (!payload || !payload.userId) {
        return next(new Error('Invalid token'));
      }

      // Attach user info to socket
      socket.data.userId = payload.userId;
      
      // Fetch user details
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          universityId: true
        }
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.data.user.email} (${socket.id})`);

    // Join user's personal room
    socket.join(`user:${socket.data.userId}`);

    // Join university room
    if (socket.data.user.universityId) {
      socket.join(`university:${socket.data.user.universityId}`);
    }

    // Join conversation rooms
    socket.on('join:conversation', async (conversationId: string) => {
      try {
        // Verify user is a participant
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            conversationId,
            userId: socket.data.userId
          }
        });

        if (participant) {
          socket.join(`conversation:${conversationId}`);
          socket.emit('joined:conversation', { conversationId });
          console.log(`User ${socket.data.user.email} joined conversation ${conversationId}`);
        } else {
          socket.emit('error', { message: 'Not a participant of this conversation' });
        }
      } catch (error) {
        console.error('Join conversation error:', error);
        socket.emit('error', { message: 'Failed to join conversation' });
      }
    });

    // Leave conversation room
    socket.on('leave:conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      socket.emit('left:conversation', { conversationId });
    });

    // Send message
    socket.on('message:send', async (data: {
      conversationId: string;
      content: string;
      attachments?: string[];
    }) => {
      try {
        // Verify participation
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            conversationId: data.conversationId,
            userId: socket.data.userId
          }
        });

        if (!participant) {
          socket.emit('error', { message: 'Not authorized to send messages in this conversation' });
          return;
        }

        // Create message
        const message = await prisma.message.create({
          data: {
            conversationId: data.conversationId,
            senderId: socket.data.userId,
            content: data.content,
            attachments: data.attachments || []
          },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        });

        // Update conversation timestamp
        await prisma.conversation.update({
          where: { id: data.conversationId },
          data: { updatedAt: new Date() }
        });

        // Broadcast to conversation room
        io.to(`conversation:${data.conversationId}`).emit('message:new', message);

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing:start', (data: { conversationId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing:user', {
        conversationId: data.conversationId,
        user: {
          id: socket.data.userId,
          firstName: socket.data.user.firstName,
          lastName: socket.data.user.lastName
        }
      });
    });

    socket.on('typing:stop', (data: { conversationId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing:stop', {
        conversationId: data.conversationId,
        userId: socket.data.userId
      });
    });

    // Mark messages as read
    socket.on('messages:read', async (data: { conversationId: string }) => {
      try {
        const unreadMessages = await prisma.message.findMany({
          where: {
            conversationId: data.conversationId,
            senderId: { not: socket.data.userId },
            reads: {
              none: {
                userId: socket.data.userId
              }
            }
          }
        });

        await Promise.all(
          unreadMessages.map((msg: any) =>
            prisma.messageRead.create({
              data: {
                messageId: msg.id,
                userId: socket.data.userId
              }
            })
          )
        );

        // Notify other participants
        socket.to(`conversation:${data.conversationId}`).emit('messages:read', {
          conversationId: data.conversationId,
          userId: socket.data.userId,
          count: unreadMessages.length
        });

      } catch (error) {
        console.error('Mark as read error:', error);
      }
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.data.user.email} (${socket.id})`);
    });
  });

  console.log('✅ WebSocket server initialized');
  return io;
};
