const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
//import route
const userRoute = require("./src/routes/user.route");
const postsRoute = require("./src/routes/posts.route");

//authen middleware
const authenToken = require("./src/middleware/authToken.middleware");

const port = process.env.PORT || 8080;

// Set up database
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, () => {
  console.log("Connected to mongo database!");
});
//App setting
app.use(express.json());
app.use(cors());
app.get("/", (req, res, next) => {
  const token = jwt.sign(req.body.id, process.env.ACCESS_TOKEN_SECRET);
  res.send(token);
});
//Routing

app.use("/user", userRoute);
app.use("/post", authenToken, postsRoute);

//Run server
app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
