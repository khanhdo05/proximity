// backend/routes/userRoutes.js
const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  const { username } = req.body;
  try {
    const newUser = new User({ username });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Username already taken" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

module.exports = router;
