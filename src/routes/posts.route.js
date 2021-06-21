const postsRoute = require("express").Router();

const postsController = require("../controller/posts.controller");
const upload = require("../middleware/fileUpload.middleware");



postsRoute.post("/create", upload.array("photos", 10), postsController.createPost);
postsRoute.delete("/delete/:postId", postsController.deletePost);
module.exports = postsRoute;
