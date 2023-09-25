import {} from "dotenv/config";

import mongoose from "mongoose";
import Room from "../models/Room.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = (req, res, next) => {
  
};

export const login = (req, res, next) => {

};

export const logout = (req, res, next) => {

};

export const forgetPassword = (req, res, next) => {

};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.header("authorization")
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).message("Token is null");
  }

  console.log("Verifying JWT...");
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) {
      return res.sendStatus(403);
    }

    // Attach user instance to requests
    req.user = user;

    next();
  });
};

export const getJWT = (req, res, next) => {
  try {
    const username = "test";
    const token = jwt.sign(
      {
        username: username
      },   
      process.env.TOKEN_SECRET, 
      { 
        expiresIn: 60 * 30 // secs 
      }
    );
  
    console.log("Sending jwt response...");
    res.status(200).send({
      "jwt": token,
    });
  } catch (e) {
    console.error(e); 
  }
};

const generateAccessToken = (userId) => {
  return jwt.sign(userId, process.env.TOKEN_SECRET, {
    expiresIn: "3600s"
  });
};

const generateRefreshToken = (username) => {
  return jwt.sign(username, process.env.TOKEN_SECRET, {
    expiresIn: "180d"
  });
};