import express from "express";
const router = express.Router();
import {createChat, getChatById, addParticipantsToChat} from '../controllers/chat.js';

// Create a new chat
router.post('/', createChat);

// Get details of a chat by ID
router.get('/:chatId', getChatById);

// Add participants to an existing chat
router.patch('/:chatId', addParticipantsToChat);

// Other chat routes...

export default router
