import User from "../models/user.js";
import jwt from "jsonwebtoken";

import { hashPassword, checkPassword } from "../utils/password.js";

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required",
    });
  }

  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid email format",
    });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "Email already in use",
      });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      first_name: firstName,
      last_name: lastName,
      email,
      password: hashedPassword,
    });
    const userJSON = newUser.toJSON();
    delete userJSON.password;

    res.status(201).json({
      status: "success",
      data: userJSON,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required",
    });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await checkPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const getMe = async (req, res) => {
  try {
    // req.user ya viene poblado por el middleware authenticateToken como una instancia del modelo User
    const user = req.user;

    const userJSON = user.toJSON();
    delete userJSON.password;

    res.status(200).json({
      status: "success",
      data: userJSON,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export { registerUser, loginUser, getMe };
