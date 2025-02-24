const User = require('../models/User');
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userController = {
  signup: async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.status(201).json({ user_id: user._id, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.json({ token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  searchUsers: async (req, res) => {
    try {
      const users = await User.find({
        username: new RegExp(req.query.username, 'i'),
        _id: { $ne: req.user.userId }
      }).select('_id username');
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  addContact: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      if (!user.contacts.includes(req.body.contact_user_id)) {
        user.contacts.push(req.body.contact_user_id);
        await user.save();
      }
      res.json({ message: 'added' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },


  getContacts : async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).populate('contacts', '_id username');
      res.json(user.contacts);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteContact: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      
      // Remove contact from user's list
      user.contacts = user.contacts.filter(id => id.toString() !== req.body.contact_user_id);
      await user.save();

      // Delete messages between the two users
      await Message.deleteMany({
        $or: [
          { sender: req.user.userId, receiver: req.body.contact_user_id },
          { sender: req.body.contact_user_id, receiver: req.user.userId }
        ]
      });

      res.json({ message: 'Contact deleted and messages removed' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }






};

module.exports = userController;
