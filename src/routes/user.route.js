const userRoute = require("express").Router();
const userController = require("../controller/user.controller");

const upload = require("../middleware/fileUpload.middleware");
const verifyToken = require("../middleware/verifyToken.middleware");
const authorUser = require("../middleware/authorizeUser.middleware");

userRoute.post("/login", userController.login);
userRoute.post("/register", upload.single("avatar"), userController.register);
userRoute.get("/:account", verifyToken, authorUser, userController.about);

module.exports = userRoute;
