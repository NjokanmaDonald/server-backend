import Chat from "../models/Chat.js";

// Create a new chat
export const createChat = async (req, res) => {
  try {
    const { clientParticipant, professionalParticipant } = req.body;

    // Ensure both clientParticipants and professionalParticipants are provided
    if (!clientParticipant || !professionalParticipant) {
      return res.status(400).json({ error: 'Both clientParticipants and professionalParticipants are required.' });
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({ clientParticipant, professionalParticipant });
    if (existingChat) {
      return res.json({ success: true, chat: existingChat, message: 'Chat already exists' });
    }

    // Create a new chat document
    const chat = new Chat({
      clientParticipant,
      professionalParticipant,
      // You can add more fields here as needed
      // messages
    });

    // Save the chat to the database
    await chat.save();

    // Return success response
    res.status(201).json(chat);
  } catch (error) {
    // Handle errors
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get details of a chat by ID
export const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Find the chat by ID
    const chat = await Chat.findById(chatId)
      // .populate('clientParticipants', 'username') // Populate clientParticipants with username field
      // .populate('professionalParticipants', 'username'); // Populate professionalParticipants with username field

    // Check if chat exists
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Return chat details
    res.status(200).json(chat);
  } catch (error) {
    // Handle errors
    console.error('Error fetching chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Add participants to an existing chat
export const addParticipantsToChat= async (req, res) => {
  try {
    const { chatId } = req.params;
    const { clientParticipants, professionalParticipants } = req.body;

    // Find the chat by ID
    const chat = await Chat.findById(chatId);

    // Check if chat exists
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Add new participants to the chat
    if (clientParticipants) {
      chat.clientParticipants.push(...clientParticipants);
    }
    if (professionalParticipants) {
      chat.professionalParticipants.push(...professionalParticipants);
    }

    // Save the updated chat
    await chat.save();

    // Return success response
    res.status(200).json(chat);
  } catch (error) {
    // Handle errors
    console.error('Error adding participants to chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

