import mongoose from "mongoose";

const MessageSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Room"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;