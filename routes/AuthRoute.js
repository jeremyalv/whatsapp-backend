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

AuthRouter.post("/register", register);
AuthRouter.post("/login", login);
AuthRouter.post("/logout", logout);
AuthRouter.post("/forget-password", forgetPassword);
AuthRouter.post("/jwt", getJWT);
AuthRouter.post("/verify", authenticateToken, (req, res) => {
  if (req.user) {
    res.status(200).send({
      user: req.user
    })
  }
  res.status(200).send("req.user == null");
});

export default AuthRouter;