import mongoose from "mongoose";
import Room from "../models/Room.js";
import Message from "../models/Message.js";

export const ADD_MESSAGE = async ({ content, room, user }) => {
  // Create the new message
  const newMessage = await new Message({
    content: content,
    room: room._id,
    user: user ? user._id : null
  });

  // Save the message to db
  newMessage.save();

  // Return message to user
  return Message.populate(newMessage, {
    path: "user",
    select: "first_name last_name avatar_url"
  });
};
