import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import dotenv from "dotenv";
import status from "http-status";
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

const isLibrarian = async (req, res, next) => {
  const userRole = req.user?.role;

  if (!userRole) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No user role found.",
    });
  }

  if (userRole !== "librarian") {
    return res.status(status.FORBIDDEN).json({
      success: false,
      message: "Access forbidden. Librarian permissions required.",
    });
  }

  next();
};

export { authMiddleware, isLibrarian };
