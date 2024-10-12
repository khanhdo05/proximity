const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/connect');
const { Schema, model } = require('mongoose');

const app = express();
const port = 5000;

app.use(bodyParser.json());

app.use(
  cors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    credentials: true,
  })
);

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

connectDB().then((r) => console.log(r));

// User schema and model
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
});

const User = model('User', userSchema);

// Use routes
app.use('/api/user', require('./routes/userRoutes'));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
