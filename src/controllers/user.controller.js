import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import status from "http-status";

export const register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    if (!username || !password || !role) {
      return res
        .status(status.NOT_ACCEPTABLE)
        .json({ message: "Fill all details" });
    }

    const Vuser = await User.findOne({ username });
    if (Vuser) {
      return res
        .status(status.CONFLICT)
        .json({ message: "User already registered" });
    }

    const user = new User({
      username,
      password,
      role,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "30m" }
    );

    return res.status(status.CREATED).json({
      message: "User created successfully.",
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (e) {
    console.error("Registration error:", e);
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error occurred during registration" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(status.NOT_ACCEPTABLE)
      .json({ message: "Fill all the fields" });
  }

  try {
    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res
        .status(status.NOT_FOUND)
        .json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res
        .status(status.NOT_FOUND)
        .json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "30m" }
    );

    return res.status(status.OK).json({
      message: "Login Successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (e) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: "Error occured" });
  }
};

export const getAll = async (req, res) => {
  const id = req.userId;
  if (!id)
    return res
      .status(status.UNAUTHORIZED)
      .json({ message: "Login to get details" });

  const user = await User.findById(id);
  user.password = null;
  return res.status(status.OK).json(user);
};
