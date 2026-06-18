const express = require("express");
const { UserAuth } = require("../utils/validations");
const bcrypt = require("bcrypt");
const User = require("../models/User")


const Router = express.Router();

Router.get("/users",UserAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password") // never send password
      .sort({ createdAt: -1 });

    res.json({
      message: "User data fetched Successfully",
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "firstName lastName emailId role"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(id, {
      password: hashedPassword,
    });

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


Router.get("/users/:id", UserAuth, getUserById);
Router.patch("/users/reset-password/:id", UserAuth, resetPassword);

module.exports = Router;