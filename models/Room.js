import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const RoomSchema = mongoose.Schema({
  room_token: String,
  name: {
    type: String,
    required: true, 
    trim: true,
    unique: false,
    minlength: ['3', 'Room name should be at least 3 characters long'],
    maxlength: ['20', 'Room name should be at most 20 characters long'],
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ]
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Room = mongoose.model("Room", RoomSchema);

export default Room;