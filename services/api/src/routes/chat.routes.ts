import { Router } from 'express';
import * as chatController from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Conversations
router.get('/conversations', chatController.listConversations);
router.get('/conversations/:id', chatController.getConversation);
router.post('/conversations', chatController.createConversation);
router.post('/conversations/:conversationId/participants', chatController.addParticipant);

// Messages
router.get('/conversations/:conversationId/messages', chatController.listMessages);
router.post('/messages', chatController.createMessage);
router.post('/conversations/:conversationId/mark-read', chatController.markAsRead);

export default router;
