import {} from "dotenv/config";

import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import Room from "../models/Room.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Blacklist from "../models/Blacklist.js";

/* When user have filled in register form */
/* TODO add verify phone before signup */
export const register = async (req, res, next) => {
  const { phone_number, password } = req.body;
  
  try {
    const newUser = await User.create({
      phone_number: phone_number,
      password: password,

      first_name: "",
      last_name: "",

      // Template Avatar
      avatar_url: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff",
      token: "",
    });

    // Send success message
    return res.status(201).json({
      success: true,
      message: "User created",
      data: {
        userId: newUser._id,
        phone_number: newUser.phone_number,
      }
    });
  } catch (error) {
    console.error("Register: An error occurred")
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { phone_number, password } = req.body;
  
  try {
    if (phone_number === "") {
      return res.status(400).send("Phone number cannot be empty");
    }

    if (password === "") {
      return res.status(400).send("Password cannot be empty");
    }

    const existingUser = await User.findOne({ phone_number: phone_number }); 

    if (existingUser === null) {
      return res.status(404).send("User with that phone number does not exist");
    }
  
    // const passwordsMatch = await compareToHashPassword(password, existingUser.password);
    const passwordsMatch = await existingUser.isValidPassword(password);
    
    if (!passwordsMatch) {
      return res.status(401).send("Incorrect password");
    }
    
    // Create access token by user's object id
    const token = generateAccessToken(existingUser._id);
    
    // Append token to user data
    existingUser.token = token;
    
    console.log("existingUser", existingUser);
    // Send success response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        userId: existingUser._id,
        phone_number: existingUser.phone_number,
        token: existingUser.token,
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
      return res.status(401).send("You must log in before you can log out");
    }
    
    const cookie = authHeader.split("=")[1];
    const accessToken = cookie.split(";")[0];

    // Check if the access token is blacklisted
    const isTokenBlacklisted = await Blacklist.findOne({ token: accessToken });

    if (isTokenBlacklisted) {
      return res.status(401).send("Token is deprecated");
    }

    // Otherwise, add token to Blacklist data
    await Blacklist.create({
      token: accessToken,
    });

    // Clear request cookie on client
    res.setHeader('Clear-Site-Data', '"cookies", "storage"');

    return res.status(200).json({
      success: true,
      message: "Successfully logged out",
    });
  } catch (error) {
    console.error("Logout: An error occurred");
    next(error); 
  }

  console.log("Logout: Outside try-catch block");
  next();
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

// const compareToHashPassword = async (inputPassword, realPassword) => {
//   return await bcryptjs.compare(inputPassword, realPassword);
// };

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