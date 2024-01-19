require("dotenv").config();

const mongoose = require("mongoose");
const Post = require("./models/Post");

mongoose.connect(process.env.MONGODB_URI);

const populateDb = async () => {
  Post.create({
    author: "SpectreFury",
    title: "Dummy blog is sad but so am I",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  });

  console.log("Post created");
};

populateDb();
