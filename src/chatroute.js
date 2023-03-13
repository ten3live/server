// routes.js

const express = require("express");
// models/Session.js

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

const router = express.Router();

// Get all sessions
router.get("/sessions", async (req, res) => {
  try {
    const sessions = await Session.find();
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Get a session by ID
router.get("/sessions/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Create a new session
router.post("/sessions", async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Update a session by ID
router.put("/sessions/:id", async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Delete a session by ID
router.delete("/sessions/:id", async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
