const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function validations(value) {
  const { firstName, lastName, emailId } = value;
  if (!firstName || !lastName || !emailId) {
    throw new Error("Name should be Valid");
  } else if (firstName.length > 50 || firstName.length < 2) {
    throw new Error("Name should be between length 2 to 50");
  } else if (emailId.length > 50 || emailId.length < 2) {
    throw new Error("User id should be between length 2 to 50");
  } 
}

async function UserAuth(req, res, next) {
  try {
    const token = await req.cookies.token;
    if (!token) {
     res.status(401).send("Please Login")
    } else {
      const decodedId = await jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decodedId);
      if (!user) {
        throw new Error("User Not found");
      } else {
        req.user = user;
        next();
      }
    }
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err);
  }
}

module.exports = { validations, UserAuth };
