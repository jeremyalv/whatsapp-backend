import express from "express";

import { getRoomMessages, addMessage } from "../controllers/RoomController.js";

const RoomRouter = express.Router();

RoomRouter.get(`/:id`, getRoomMessages);
RoomRouter.post(`/:id`, addMessage);

export default RoomRouter;
