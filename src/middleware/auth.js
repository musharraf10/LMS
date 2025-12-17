import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    // console.log(authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Missing or invalid auth header" });
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "undefined") {
      return res.status(401).json({ message: "Token not found or malformed" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export { authMiddleware };
