import mongoose from "mongoose";
import Room from "../models/Room.js";
import Message from "../models/Message.js";

import { GET_ROOM_MESSAGES, ADD_MESSAGE } from "../actions/socketio.js";
import User from "../models/User.js";

const getRoomById = async (roomId) => {
  const room = await Room.findById(roomId);
  return room;
};

export const getRoomMessages = async (req, res, next) => {
  // Use params.id, NOT params._id!
  const room = await getRoomById(req.params.id);
  
  if (!room) {
    res.status(404).send("Room does not exist!");
  }
  
  const messages = await GET_ROOM_MESSAGES(room);

  if (!messages) {
    res.status(400).send("Bad request when getting room messages");
  }

  res.status(200).json({
    status: "success",
    message: "Room messages fetched sucecssfully",
    room: room,
    room_messages: messages
  });
};

export const addMessage = async (req, res, next) => {
  try {
    const room = await getRoomById(req.params.id);
    const content = req.body.content;
    let userId;

    const bodyUser = req.body.user;
        
    if (typeof bodyUser === "string" || bodyUser instanceof String) {
      userId = new mongoose.Types.ObjectId(bodyUser); 
    } else if (bodyUser instanceof mongoose.Types.ObjectId) {
      userId = bodyUser;
    } else if (bodyUser instanceof User) {
      userId = bodyUser._id;
    } else {
      res.status(400).send("Bad request when parsing message Sender ID.");
    }
    
    const result = await ADD_MESSAGE(content, room._id, userId);
  
    res.status(200).json({
      status: 200,
      message: "Successfully created a new message.",
      created_message: result
    });
  } catch (e) {
    console.error(e);
    res.status(400).send("Bad request when creating new message.");
  }
};