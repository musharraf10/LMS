import express from "express";
import { register, login, getAll } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.route("/signup").post(register);
userRouter.route("/signin").post(login);

userRouter.route("/getinfo").get(authMiddleware, getAll);

export default userRouter;
