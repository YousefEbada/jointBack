import { Router } from 'express';
import { ChatController } from './controllers/chat.controller.js';
import { auth } from 'shared/middleware/auth.js';
// import { validate } from 'shared/middleware/validate.js';
// import { 
//     createRoomSchema, 
//     sendMessageSchema,
//     getRoomMessagesSchema,
//     markMessagesReadSchema
// } from './validation/chat.schemas.js';

const router = Router();

// All chat routes require authentication
router.use(auth);

// Chat rooms
router.get('/rooms', ChatController.getRooms);
// validate(createRoomSchema)
router.post('/rooms', ChatController.createRoom);

// Messages
router.get('/rooms/:roomId/messages', ChatController.getMessages);
// validate(getRoomMessagesSchema)
router.post('/messages', ChatController.sendMessage);

// Mark messages as read
router.post('/rooms/:roomId/mark-read', ChatController.markMessagesAsRead);

export default router;