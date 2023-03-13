const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  participants: [String],
  messages: [
    {
      text: String,
      user: String,
      createdAt: Date,
    },
  ],
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
