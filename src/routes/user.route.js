const userRoute = require("express").Router();
const userController = require("../controller/user.controller");

const upload = require("../middleware/fileUpload.middleware");

userRoute.post("/login", userController.login);
userRoute.post("/register", upload.single("avatar"), userController.register);

module.exports = userRoute;
