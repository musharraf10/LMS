import express from "express";
import mongoose from "mongoose";
import userRouter from "./src/routes/user.route.js";

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

app.use("/api/auth", userRouter);

app.listen(8080, () => {
  console.log("App started successfully");
});
