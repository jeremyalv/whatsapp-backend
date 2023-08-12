import mongoose from "mongoose";
import Room from "../models/Room.js";
import Message from "../models/Message.js";

import { GET_ROOM_MESSAGES } from "../actions/socketio.js";

const getRoomById = async (roomId) => {
  const room = await Room.findById(roomId);
  return room;
};

export const getRoomMessages = async (req, res, next) => {
  const room = getRoomById(req.params._id);
  const messages = GET_ROOM_MESSAGES(room);

  if (!messages) {
    res.status(400).send("Bad request when getting room messages");
  }

  res.status(200).json({
    status: "success",
    message: "Messages received sucecssfully",
    room_messages: messages
  });
};