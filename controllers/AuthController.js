import {} from "dotenv/config";

import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import Room from "../models/Room.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Blacklist from "../models/Blacklist.js";

/* When user have filled in register form */
/* TODO add verify email before signup */
export const register = async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
    const newUser = await User.create({
      email: email,
      username: email,
      password: password,

      first_name: "",
      last_name: "",

      // Template Avatar
      avatar_url: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff",
      token: "",
    });

    // Send success message
    res.status(201).json({
      success: true,
      message: "User created",
      data: {
        userId: newUser._id,
        email: newUser.email,
      }
    });
  } catch (error) {
    console.error("Register: An error occurred")
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ email: email }); 

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
    next(error);
  }
};

export const logout = async (req, res, next) => {
  /** TODO 
   * Create optimized version using Redis
   * https://dev.to/mr_cea/using-redis-for-token-blacklisting-in-node-js-42g7
   */
  
  try {
    const authHeader = req.headers["cookie"];
    
    if (!authHeader) {
      return res.status(204);
    }
    
    const cookie = authHeader.split("=")[1];
    const accessToken = cookie.split(";")[0];

    // Check if the access token is blacklisted
    const isTokenBlacklisted = await Blacklist.findOne({ token: accessToken });

    if (isTokenBlacklisted) {
      return res.sendStatus(204);
    }

    // Otherwise, blacklist token
    const newBlacklist = await Blacklist.create({
      token: accessToken,
    });

    // Clear request cookie on client
    res.setHeader('Clear-Site-Data', '"cookies", "storage"');

    res.status(200).json({
      message: "Successfully logged out",
    });
  } catch (error) {
    console.error("Logout: An error occurred");
    next(error); 
  }

  res.send(204);
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
      return res.status(403).send("An error occurred when verifying JWT");
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