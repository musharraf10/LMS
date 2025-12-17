import express from "express";
import { addBook } from "../controllers/book.controller.js";
import { authMiddleware, isLibrarian } from "../middleware/auth.js";

const bookRouter = express.Router();

bookRouter.route("/newbook").post(authMiddleware, isLibrarian, addBook);

export default bookRouter;
