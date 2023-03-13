const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({
  text: String,
  user: {
    _id: Number,
    name: String,
  },
  createdAt: Date,
});

const Message = mongoose.model('Message', messagesSchema);

router.get('/messages', async (req, res) => {
  const {recipientId, senderId} = req.query;
  const query = {
    recipientId,
    'user._id': senderId,
  };
  const messages = await Message.find(query).sort({createdAt: -1});
  res.json(messages);
});

router.post('/messages', async (req, res) => {
  const {text, user} = req.body;
  const message = new Message({
    text,
    user,
    createdAt: new Date(),
  });
  await message.save();
  res.json(message);
});

module.exports = router;
