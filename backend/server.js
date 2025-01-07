const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors"); // Import the cors package
require("dotenv").config(); // Import and configure dotenv

const bodyParser = require('body-parser');
const vm = require('vm');  // VM module for sandboxed execution

const app = express();
const server = http.createServer(app);
const ACTIONS = require("./actions");
// Middleware to parse JSON bodies
app.use(bodyParser.json());

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
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
      content,
    });
  });

  
  socket.on(ACTIONS.SYNC_CODE, ({ joinedUserSocketId, content }) => {
    io.to(joinedUserSocketId).emit(ACTIONS.CODE_CHANGE, {
      content
    });
  });
});


// Function to securely execute JavaScript code in a sandbox
const executeCode = (code) => {
  // Output storage for captured logs
  const output = [];

  // Create a sandbox environment
  const sandbox = {
    console: {
      log: (...args) => {
        output.push(args.join(' ')); // Capture console.log output
      },
    },
    // You can add more global variables here if needed
  };

  try {
    // Create a new VM context with the sandbox
    const context = vm.createContext(sandbox);

    // Execute the code in the sandboxed environment
    const script = new vm.Script(code);
    script.runInContext(context);

    return { result: output.join('\n') }; // Return captured output as result
  } catch (error) {
    return { error: error.message }; // Return error if code execution fails
  }
};


// API route to handle code execution requests
app.post('/execute', (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  const executionResult = executeCode(code);
  res.json(executionResult); // Send result back to frontend
});

const PORT = process.env.PORT || 5000;
// Start the server
server.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});
