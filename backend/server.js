const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors"); // Import the cors package
require("dotenv").config(); // Import and configure dotenv
const app = express();
const server = http.createServer(app);
const ACTIONS = require("./actions");

// Use CORS middleware to allow cross-origin requests
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your client app URL (e.g., React app running on localhost:3000)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, // Replace with your client app URL
    methods: ["GET", "POST"],
  },
});

const socketToUserMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: socketToUserMap[socketId],
      };
    }
  );
}
// Handle client connections
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on(ACTIONS.JOIN, ({ username, roomId }) => {
    socketToUserMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        joinedUserSocketId: socket.id,
      });
    });
  });

  // disconnecting event is called
  socket.on("disconnecting", () => {
    console.log("Disconnect called");
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: socketToUserMap[socket.id],
      });

      socket.leave(roomId);
    });

    delete socketToUserMap[socket.id];
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, content }) => {
    console.log("ROOM : ", roomId, " Code change : ", content);
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
      content,
    });
  });
});

const PORT = process.env.PORT || 5000;
// Start the server
server.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});
