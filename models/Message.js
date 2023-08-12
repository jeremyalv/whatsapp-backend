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
}, 
{
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;