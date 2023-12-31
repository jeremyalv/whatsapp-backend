import express from "express";

import {
  register,
  login,
  logout,
  forgetPassword,
  authenticateToken,
  getJWT
} from "../controllers/AuthController.js";

const AuthRouter = express.Router();

// TODO check for frontend
// https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs
AuthRouter.post("/register", register);
AuthRouter.post("/login", login);
AuthRouter.post("/logout", logout);
AuthRouter.post("/forget-password", forgetPassword);

// For dev purposes only
AuthRouter.post("/jwt", getJWT);
AuthRouter.post("/verify", authenticateToken, (req, res) => {
  try {
    res.status(200).json({
      user: req.user
    })
  } catch (err) {
    console.error("VerifyError:", err);
  }
});

export default AuthRouter;