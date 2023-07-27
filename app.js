import {} from "dotenv/config";
import express from "express";
import http from "node:http";
import { Server} from "socket.io";
import cors from "cors";

// Setup Express server
const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());

// Create Socket.IO Server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});

// Socket.IO events
io.on("connection", (socket) => {
  // When connected, send welcome message
  console.log(`User ${socket.id} connected`);


  // When a user joins a room
  socket.on("join_room", (data) => {
    console.log("User joined room: " + data);
  });

  // When a user sends a message
  socket.on("send_message", (data) => {
    console.log("User sent message: " + data.message);
  });
  
  // When a user leaves a room
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
})

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
