import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

// Send a new message
export const sendMessage = async(req, res) => {
  try {
    const { sender, receiver, content, chat } = req.body;

    // Ensure either clientSender or professionalSender is provided
    if (!sender && !receiver) {
      return res.status(400).json({ error: 'Either clientSender or professionalSender is required.' });
    }

    // Create a new message document
    const message = new Message({
      sender,
      receiver,
      content,
      chat
    });


    // Save the message to the database
    const savedMessage = await message.save();

    const chats = await Chat.findById(chat);
    console.log(chats);

    if (!chats) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    chats.messages.push(savedMessage._id);

    const updatedChat = await chats.save();

    // Return success response
    res.status(201).json(savedMessage);
  } catch (error) {
    // Handle errors
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get messages for a chat
export const getChatMessages= async (req, res) => {
  try {
    const { chatId } = req.params;

    // Find messages for the specified chat
    const messages = await Message.find({ chat: chatId });

    // Return messages
    res.status(200).json(messages);
  } catch (error) {
    // Handle errors
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Other controller methods for updating message details, deleting messages, etc.

// module.exports = {
//   sendMessage,
//   getChatMessages,
//   // Other exported methods
// };
