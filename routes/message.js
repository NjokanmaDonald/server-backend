import express from "express";
const router = express.Router();
import {sendMessage, getChatMessages }from '../controllers/message.js'

// Send a new message
router.post('/', sendMessage);

// Get messages for a chat
router.get('/chat/:chatId', getChatMessages);

// Other message routes...

export default router
