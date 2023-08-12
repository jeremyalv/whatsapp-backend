import {} from "dotenv/config";
import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";

import User from "./models/User.js";
import Room from "./models/Room.js";

import cors from "cors";
import { db_username, db_password, db_cluster, db_name, server_port } from "./config/db.js";

import {
  ADD_MESSAGE,
  GET_ROOM_MESSAGES
} from "./actions/socketio.js";

import RoomRouter from "./routes/RoomRoute.js";

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

// Clear DB
// #await User.deleteMany({}); Commented for testing reasons
// #await Room.deleteMany({});

// Seed DB
// await User.create({
//   email: "jere@email.com",
//   username: "jere",
//   first_name: "Jere",
//   last_name: "Andreson",  
//   avatar_url: "",
//   token: "",
//   password: "password",
// });

// await User.create({
//   email: "jameson@email.com",
//   username: "jameson",
//   first_name: "Jameson",
//   last_name: "Andrews",  
//   avatar_url: "",
//   token: "",
//   password: "password",
// });

// await Room.create({
//   room_token: "QWERTY999",
//   name: "The Avengers",
//   users: [
//     new mongoose.Types.ObjectId('64d734debf25a464aa5010fc'),
//     new mongoose.Types.ObjectId('64d734dfbf25a464aa5010fe')
//   ]
// });

// Middlewares
app.use(cors());

// Express API Routing
app.use("/api/room", RoomRouter);


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
    // Join the user to the room
    socket.join(roomData._id);

    // Emit event to all other users in the room
    // TODO pass in current user as argument
    socket.to(roomData._id).emit("user_joined_room", socket.id, roomData);

    // Notify console regarding the event
    console.log(`User ${socket.id} joined room ${roomData._id}`);
  });

  // Sends notifications when a user joins a room
  socket.on("user_joined_room", (socketId, roomData) => {
    console.log(`Hey! The user ${socketId} has joined your room (${roomData._id})`);
  });

  // When a user sends a message
  socket.on("send_message", ({ room, message }) => {
    console.log(`User ${socket.id} sent message to room ${room.name}: "${message}"`);

    // Emit data back to client for display
    io.to(room._id).emit("receive_message", message);
  });


  // When the room members receives a message
  socket.on("receive_message", (message) => {
    console.log("receive_message: ", message);
  })
  
  // When a user is disconnected from a room
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
})

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
