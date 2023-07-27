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

server.listen();
