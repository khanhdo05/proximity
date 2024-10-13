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

wss.on('connection', (ws) => {
  console.log('New client connected');
  ws.on('error', console.error);
  ws.on('message', (message) => {
    console.log('received: %s', message);
  });

  clients.push(ws);

  ws.on('error', console.error);

  ws.on('message', (message) => {
    console.log('received: %s', message);
    // Broadcast the message to all connected clients
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
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
