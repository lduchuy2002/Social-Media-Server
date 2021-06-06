const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("./src/model/user.model");
const userRoute = require("./src/routes/user.route");

const port = process.env.PORT || 8080;
app.use(express.json());
app.use(cors());
// Set up database
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, () => {
  console.log("Connected to mongo database!");
});
//App setting
app.post("/", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 13);
    const user = new User({
      account: req.body.account,
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      avatar: req.body.avatar,
    });
    await user.save();
  } catch (error) {
    next(error.message);
  }
});
//Routing
app.use("/user", userRoute);
app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
