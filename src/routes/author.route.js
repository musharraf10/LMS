import express from "express";
import { authMiddleware, isLibrarian } from "../middleware/auth.js";
import { addAuthor } from "../controllers/author.controller.js";

const authorRouter = express.Router();

authorRouter.route("/newauthor").post(authMiddleware, isLibrarian, addAuthor);

export default authorRouter;
