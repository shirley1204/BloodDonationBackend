const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
    },
    password: {
      type: String,
    },
   role:{
     type: String,
      enum: ["admin", "user"],
      default: "user",
   }
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  }); //field with secret key
  return token;
};

userSchema.methods.checkPassword = async function (inputPasswordByUser) {
  const user = this;
  const hashPassword = user.password;
  const isPasswordValid = await bcrypt.compare(inputPasswordByUser, hashPassword)
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
