const postsRoute = require("express").Router();

const postsController = require("../controller/posts.controller");
const upload = require("../middleware/fileUpload.middleware");

postsRoute.post("/", upload.array("photos", 10), postsController.createPost);

module.exports = postsRoute;
