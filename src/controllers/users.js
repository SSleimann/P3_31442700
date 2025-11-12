import User from "../models/user.js";

import { hashPassword } from "../utils/password.js";

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    const sanitizedUsers = users.map((user) => {
      const { password, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    });

    res.status(200).json({
      status: "success",
      data: sanitizedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid user ID format",
    });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    const { password, ...userWithoutPassword } = user.toJSON();
    res.status(200).json({
      status: "success",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const createUser = async (req, res) => {
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
        message: "Email already exists",
      });
    }

    const newUser = await User.create({
      first_name: firstName,
      last_name: lastName,
      email,
      password: await hashPassword(password),
    });
    const userJSON = newUser.toJSON();
    delete userJSON.password;

    res.status(201).json({
      status: "success",
      data: userJSON,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;

  if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid user ID format",
    });
  }

  if (!firstName || !lastName || !email) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields",
    });
  }

  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid email format",
    });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const findUserWithEmail = await User.findOne({ where: { email } });
    if (findUserWithEmail) {
      return res.status(409).json({
        status: "error",
        message: "Email already exists",
      });
    }

    user.first_name = firstName;
    user.last_name = lastName;
    user.email = email;

    await user.save();

    const userData = user.toJSON();
    delete userData.password;

    res.status(200).json({
      status: "success",
      data: userData,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid user ID format",
    });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    await user.destroy();

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };
