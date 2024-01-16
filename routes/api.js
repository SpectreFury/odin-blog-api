const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      throw new Error("Email already exists, try another");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    await User.create({
      email: req.body.email,
      password: hashedPassword,
    });

    res.json({
      status: "successful",
      message: "User created",
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      throw new Error("No user found");
    }

    const passwordMatched = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatched) {
      throw new Error("Password is incorrect");
    }

    const token = await jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.json({
      status: "successful",
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
    console.log(error);
  }
});

module.exports = router;
