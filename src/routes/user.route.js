const userRoute = require("express").Router();
const userController = require("../controller/user.controller");
userRoute.post("/login", userController.login);
userRoute.get("/", (req, res, next) => {
  res.send("hello");
});

module.exports = userRoute;
