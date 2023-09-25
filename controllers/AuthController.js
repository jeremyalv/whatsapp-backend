import {} from "dotenv/config";

import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import Room from "../models/Room.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = (req, res, next) => {
  
};

export const login = async (req, res, next) => {
  const { email, password }= req.body;
  let existingUser;
  
  try {
    existingUser = await User.findOne({ email: email }); 

    if (!existingUser) {
      res.status(401).send("User does not exist");
    }
  
    // const passwordsMatch = await compareToHashPassword(password, existingUser.password);

    const passwordsMatch = await existingUser.isValidPassword(password);
  
    if (!passwordsMatch) {
      res.status(401).send("Incorrect password");
    }
  
    // Create access token by user's object id
    const token = generateAccessToken(existingUser._id);
  
    // Send success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        userId: existingUser._id,
        email: existingUser.email,
        token: token,
      },
    });
  } catch (error) {
    console.error("Login: An error occurred")
    return next(error);
  }
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

const compareToHashPassword = async (inputPassword, realPassword) => {
  return await bcryptjs.compare(inputPassword, realPassword);
};

const generateAccessToken = (userId) => {
  return jwt.sign(
    {
      userId: userId
    }, 
    process.env.TOKEN_SECRET, 
    {
      expiresIn: 60 * 60
    }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      userId: userId
    }, 
    process.env.TOKEN_SECRET, 
    {
      expiresIn: "180d"
    }
  );
};