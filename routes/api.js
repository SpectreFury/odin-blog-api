const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

router.get("/post", async (req, res) => {
  try {
    const posts = await Post.find({});

    if (!posts.length) {
      throw new Error("No posts found");
    }

    res.json({
      status: "successful",
      posts,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
    console.log(error);
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });

    if (!post) {
      throw new Error("No post found");
    }

    res.json({
      status: "successful",
      post,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
    console.log(error);
  }
});

router.post("/comment", async (req, res) => {
  try {
    const comment = new Comment({
      text: req.body.text,
    });

    await Post.updateOne(
      {
        _id: req.body.postId,
      },
      {
        $push: {
          comments: comment,
        },
      }
    );

    res.json({
      status: "successful",
      message: "Comment added",
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
    console.log(error);
  }
});

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

router.post("/post", async (req, res) => {
  try {
    const token = req.headers["x-access-token"];

    if (!token) {
      throw new Error("You are not logged in");
    }

    const user = await jwt.verify(token, process.env.JWT_SECRET);

    if (!user) {
      throw new Error("Invalid token");
    }

    await Post.create({
      title: req.body.title,
      content: req.body.content,
      author: user.id,
    });

    res.json({
      status: "successful",
      message: "Post created",
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
