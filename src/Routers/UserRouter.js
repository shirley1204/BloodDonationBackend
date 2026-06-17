const express = require("express");
const { UserAuth } = require("../utils/validations");
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

module.exports = Router;