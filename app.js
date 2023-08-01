import {} from "dotenv/config";
import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";


import cors from "cors";
import { db_username, db_password, db_cluster, db_name, server_port } from "./config/db.js";


// Setup Express server
const app = express();
const server = http.createServer(app);

// Connect to MongoDB Database
mongoose
    .connect(`mongodb+srv://${db_username}:${db_password}@${db_cluster}.mongodb.net/${db_name}?retryWrites=true&w=majority`)
  .then(() => {
    console.log("Connected to MongoDB Database")
  })
  .catch((err) => {
    console.log("Error:", err);
    process.exit(1);
  })

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

  socket.on("hello", (data) => {
    console.log("Hello World");
  });

  // When a user joins a room
  socket.on("join_room", (roomData) => {
    console.log(`User ${socket.id} joined room ${roomData._id}`);
  });

  // When a user sends a message
  socket.on("send_message", (data) => {
    console.log(`User ${socket.id} sent message to room ${data.room}`);
  });
  
  // When a user leaves a room
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
})

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
