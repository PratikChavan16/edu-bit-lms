import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

// ============= CONVERSATIONS =============

const createConversationSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  type: z.enum(['direct', 'group', 'support']).default('direct'),
  participantIds: z.array(z.string().uuid()).min(1)
});

export const listConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {
      participants: {
        some: {
          userId: req.user!.id
        }
      }
    };

    if (type) where.type = type;

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  // profilePicture removed
                }
              }
            }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              sender: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          _count: {
            select: {
              messages: true
            }
          }
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.conversation.count({ where })
    ]);

    // Add unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv: any) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: req.user!.id },
            reads: {
              none: {
                userId: req.user!.id
              }
            }
          }
        });

        return {
          ...conv,
          unreadCount,
          lastMessage: conv.messages[0] || null
        };
      })
    );

    res.json({
      data: conversationsWithUnread,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('List conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

export const getConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                // profilePicture removed
              }
            }
          }
        }
      }
    });

    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      (p: any) => p.userId === req.user!.id
    );

    if (!isParticipant && !req.user?.isGodMode) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(conversation);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
};

export const createConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createConversationSchema.parse(req.body);

    // Add current user to participants if not already included
    if (!data.participantIds.includes(req.user!.id)) {
      data.participantIds.push(req.user!.id);
    }

    // For direct conversations, check if one already exists
    if (data.type === 'direct' && data.participantIds.length === 2) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          type: 'direct',
          AND: data.participantIds.map((userId: string) => ({
            participants: {
              some: { userId }
            }
          }))
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          }
        }
      });

      if (existingConversation) {
        res.json(existingConversation);
        return;
      }
    }

    const conversation = await prisma.conversation.create({
      data: {
        name: data.title,
        type: data.type,
        universityId: req.user!.universityId,
        createdBy: req.user!.id,
        participants: {
          create: data.participantIds.map((userId: string) => ({
            userId,
            role: userId === req.user!.id ? 'admin' : 'member'
          }))
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.status(201).json(conversation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
};

// ============= MESSAGES =============

const createMessageSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().min(1),
  attachments: z.array(z.string()).optional()
});

export const listMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const { page = '1', limit = '50' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Check if user is a participant
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          where: { userId: req.user!.id }
        }
      }
    });

    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    if (conversation.participants.length === 0 && !req.user?.isGodMode) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { conversationId },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              // profilePicture removed
            }
          },
          reads: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'asc' }
      }),
      prisma.message.count({ where: { conversationId } })
    ]);

    res.json({
      data: messages,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('List messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createMessageSchema.parse(req.body);

    // Check if user is a participant
    const conversation = await prisma.conversation.findUnique({
      where: { id: data.conversationId },
      include: {
        participants: {
          where: { userId: req.user!.id }
        }
      }
    });

    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    if (conversation.participants.length === 0) {
      res.status(403).json({ error: 'Not a participant of this conversation' });
      return;
    }

    const message = await prisma.message.create({
      data: {
        conversationId: data.conversationId,
        senderId: req.user!.id,
        content: data.content,
        attachments: data.attachments || []
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            // profilePicture removed
          }
        }
      }
    });

    // Update conversation's updatedAt
    await prisma.conversation.update({
      where: { id: data.conversationId },
      data: { updatedAt: new Date() }
    });

    res.status(201).json(message);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;

    // Get all unread messages in this conversation
    const unreadMessages = await prisma.message.findMany({
      where: {
        conversationId,
        senderId: { not: req.user!.id },
        reads: {
          none: {
            userId: req.user!.id
          }
        }
      }
    });

    // Mark all as read
    await Promise.all(
      unreadMessages.map((msg: any) =>
        prisma.messageRead.create({
          data: {
            messageId: msg.id,
            userId: req.user!.id
          }
        })
      )
    );

    res.json({
      message: 'Messages marked as read',
      count: unreadMessages.length
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
};

export const addParticipant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    // Check if current user is admin of the conversation
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: req.user!.id,
        role: 'admin'
      }
    });

    if (!participant && !req.user?.isGodMode) {
      res.status(403).json({ error: 'Only admins can add participants' });
      return;
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId
      }
    });

    if (existingParticipant) {
      res.status(400).json({ error: 'User is already a participant' });
      return;
    }

    const newParticipant = await prisma.conversationParticipant.create({
      data: {
        conversationId,
        userId,
        role: 'member'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(newParticipant);
  } catch (error) {
    console.error('Add participant error:', error);
    res.status(500).json({ error: 'Failed to add participant' });
  }
};
