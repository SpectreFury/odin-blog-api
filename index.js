require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api");

mongoose.connect(process.env.MONGODB_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRoutes);

app.listen(3000, () => {
  console.log("Listening on PORT 3000");
});
