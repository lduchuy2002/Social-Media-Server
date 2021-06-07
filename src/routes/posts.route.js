const postsRoute = require("express").Router();
const postsController = require("../controller/posts.controller");

postsRoute.post("/", postsController.createPost);

module.exports = postsRoute;
