const Message = require('../models/Message');

const messageController = {
  sendMessage: async (req, res) => {
    try {
      const { receiver_user_id, message } = req.body;
      const newMessage = new Message({
        sender: req.user.userId,
        receiver: receiver_user_id,
        message
      });
      await newMessage.save();
      
      // Send real-time notification via WebSocket
      req.app.locals.wsServer.sendMessage(receiver_user_id, {
        type: 'new_message',
        message: newMessage
      });
      
      res.json({ status: 'sent' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getMessages: async (req, res) => {
    try {
      const messages = await Message.find({
        $or: [
          { sender: req.user.userId, receiver: req.params.user_id },
          { sender: req.params.user_id, receiver: req.user.userId }
        ]
      }).sort('timestamp');
      res.json(messages);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = messageController;