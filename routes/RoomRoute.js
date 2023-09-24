import express from "express";

import { 
  getAllRoomData,
  getRoomMessages,
  addMessage 
} from "../controllers/RoomController.js";

const RoomRouter = express.Router();

RoomRouter.get(`/all`, getAllRoomData);
RoomRouter.get(`/:id`, getRoomMessages);
RoomRouter.post(`/:id`, addMessage);

export default RoomRouter;
