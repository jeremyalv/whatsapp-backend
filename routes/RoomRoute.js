import express from "express";

import { getRoomMessages } from "../controllers/RoomController.js";

const RoomRouter = express.Router();

RoomRouter.get(`/:id`, getRoomMessages);

export default RoomRouter;
