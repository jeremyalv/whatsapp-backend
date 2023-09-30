import {} from "dotenv/config";
import express from "express";
import http from "node:http";
import cors from "cors";
import { Server } from "socket.io";
import mongoose from "mongoose";
import passport from "passport";

import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import connectEnsureLogin from "connect-ensure-login";

import User from "./models/User.js";
import Room from "./models/Room.js";
import Message from "./models/Message.js";

import {
  ADD_MESSAGE,
  GET_ROOM_MESSAGES
} from "./actions/socketio.js";

import { db_username, db_password, db_cluster, db_name, server_port } from "./config/db.js";

import RoomRouter from "./routes/RoomRoute.js";
import AuthRouter from "./routes/AuthRoute.js";
import Blacklist from "./models/Blacklist.js";

// Setup Express server
const app = express();
const server = http.createServer(app);

// Mongoose setup
// Ensure that firewall is disabled
mongoose
  .connect(`mongodb+srv://${db_username}:${db_password}@${db_cluster}.mongodb.net/${db_name}?retryWrites=true&w=majority`)
  .then(() => {
    console.log("Connected to MongoDB Database")
  })
  .catch((err) => {
    console.log("Error:", err);
    process.exit(1);
  })

// DEV TESTING NEEDS PLACEHOLDER

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
  extended: true 
}));
app.use(cookieSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// app.use(passport.initialize());
// app.use(passport.session());

// Configure passport.js local auth
// passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// Express API Routing
// Source: https://www.sitepoint.com/local-authentication-using-passport-node-js/
// app.post("/login", (req, res, next) => {
//   console.log("INFO: login endpoint hit")
//   passport.authenticate("local", 
//     (err, user, info) => {
//       if (err) {
//         return next(err);
//       }

//       if (!user) {
//         return res.redirect("/login");
//       }

//       req.logIn(user, function(err) {
//         if (err) {
//           return next(err);
//         }

//         console.log("INFO: Authentication successful");
//         console.log("INFO: user_info: ", info);
//         return res.statusCode(200).send("Log in successful.")
//       });
//     })(req, res, next);
// });

// app.get("/logout", (req, res) => {
//   req.logOut();
// })

// // Protected endpoints
// app.get("/", 
//   connectEnsureLogin.ensureLoggedIn(), 
//   (req, res) => res.redirect("/")
// );

// app.get("/user", 
//   connectEnsureLogin.ensureLoggedIn(),
//   (req, res) => res.send({ user: req.user })
// );

app.use("/api/auth", AuthRouter);
app.use("/api/room", RoomRouter);
app.use("/api/test", (req, res, next) => {
  res.send("Hello world! The server is up and running.")
})

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
    console.log("Hello from server to client.");
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


// DEV TESTING NEEDS
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
// await Message.deleteMany({});

// await Message.create({
//   content: "Hello World",
//   room: new mongoose.Types.ObjectId("64d7356a565cb5dc4fa42a22"),
//   user: new mongoose.Types.ObjectId("64d734debf25a464aa5010fc"),
// });

// await Message.create({
//   content: "This is The Avengers speaking.",
//   room: new mongoose.Types.ObjectId("64d7356a565cb5dc4fa42a22"),
//   user: new mongoose.Types.ObjectId("64d734dfbf25a464aa5010fe"),
// });

// await Message.create({
//   content: "Is anyone bringing pizza?",
//   room: new mongoose.Types.ObjectId("64d7356a565cb5dc4fa42a22"),
//   user: new mongoose.Types.ObjectId("64d734dfbf25a464aa5010fe"),
// });

// await Blacklist.create({
//   token: "TEST"
// });