import mongoose from "mongoose";
import Room from "../models/Room.js";
import Message from "../models/Message.js";

export const ADD_MESSAGE = async (content, roomId, userId) => {
  // Create the new message
  const newMessage = await new Message({
    content: content,
    room: roomId,
    user: userId
  });

  // Save the message to db
  newMessage.save();

  // Return message to user
  return Message.populate(newMessage, {
    path: "user",
    select: "first_name last_name avatar_url"
  });
};

export const GET_ROOM_MESSAGES = async (room) => {
  return await Message.find({ room: room._id }).populate("user", [
    "username",
    "first_name",
    "last_name",
    "avatar_url"
  ]);
}