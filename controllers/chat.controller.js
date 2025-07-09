// controllers/chatController.js
const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const { content, type, imageUrl } = req.body;
  const userId = req.user.id;

  // Save user message
  const userMessage = await Message.create({
    userId,
    sender: 'user',
    content,
    type,
    imageUrl
  });

  // Get last 50 messages for context
  const contextMessages = await Message.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  // Call AI service with contextMessages
  // const aiResponse = await callAI(contextMessages);

  // Save AI message (placeholder)
  const aiMessage = await Message.create({
    userId,
    sender: 'ai',
    content: "AI response here", // aiResponse.content,
    type: 'text'
  });

  res.json({ aiMessage });
};
