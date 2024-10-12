const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./connect");
const { Schema, model } = require("mongoose");

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

connectDB().then((r) => console.log(r));

// User schema and model
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
});

const User = model("User", userSchema);

// Routes
app.post("/signup", async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
