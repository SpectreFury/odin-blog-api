require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api");
const cors = require("cors");

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRoutes);

app.listen(4000, () => {
  console.log("Listening on PORT 4000");
});
