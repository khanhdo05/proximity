const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/connect');
const { Schema, model } = require('mongoose');
const { WebSocketServer, WebSocket } = require('ws');

const app = express();
const port = 8080;
const wss = new WebSocketServer({ port: 8081 });
let clients = [];
let userToSocket = {};

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'join-room') {
      const { room, userId } = parsedMessage;

      // Map user to their socket
      userToSocket[userId] = ws;

      // Add user to the room
      if (!clients[room]) {
        clients[room] = [];
      }
      clients[room].push(ws);

      console.log(`User ${userId} joined room ${room}`);
    }

    // Broadcast message to all users in the room
    if (parsedMessage.type === 'chat-message') {
      const { text, room, sender } = parsedMessage;

      if (clients[room]) {
        clients[room].forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ text, sender }));
          }
        });
      }
    }
  });

  ws.on('close', () => {
    // Remove the user from all rooms
    Object.keys(clients).forEach((room) => {
      clients[room] = clients[room].filter((client) => client !== ws);
    });
    console.log('Client disconnected');
  });
});

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

// Use routes
app.use('/api/user', require('./routes/userRoutes'));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
