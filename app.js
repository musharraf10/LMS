import express from "express";
import mongoose from "mongoose";
import userRouter from "./src/routes/user.route.js";
import authorRouter from "./src/routes/author.route.js";
import bookRouter from "./src/routes/books.routes.js";

const app = express();

// app.use(express.urlencoded({}));

app.use(express.json({ limit: "50kb" }));

app.use(express.urlencoded({ limit: "50kb", extended: true }));
try {
  mongoose
    .connect("mongodb://127.0.0.1:27017/MongowithNode")
    .then(console.log("Mongoose connection is established"));
} catch (e) {
  console.log("Error occured. Try again!", e.message);
}

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/author", authorRouter);
app.use("/api/v1/books", bookRouter);

app.listen(8080, () => {
  console.log("App started successfully");
});
