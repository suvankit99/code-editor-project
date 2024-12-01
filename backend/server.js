const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Import the cors package
require('dotenv').config();  // Import and configure dotenv
const app = express();
const server = http.createServer(app);
const ACTIONS = require('./actions'); 

// Use CORS middleware to allow cross-origin requests
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your client app URL (e.g., React app running on localhost:3000)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, // Replace with your client app URL
    methods: ['GET', 'POST'],
  },
});

// Handle client connections
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on(ACTIONS.JOIN , () => {
    
  })
});

const PORT = process.env.PORT || 5000 ; 
// Start the server
server.listen(PORT, () => {
  console.log('Server is running on port:' , PORT);
});
