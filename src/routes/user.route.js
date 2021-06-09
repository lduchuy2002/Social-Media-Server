const userRoute = require("express").Router();
const userController = require("../controller/user.controller");

const upload = require("../middleware/fileUpload.middleware");
const authenToken = require("../middleware/authToken.middleware");

userRoute.post("/login", userController.login);
userRoute.post("/register", upload.single("avatar"), userController.register);
userRoute.get("/:account", authenToken, userController.about);

module.exports = userRoute;
