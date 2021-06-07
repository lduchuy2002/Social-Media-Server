const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Post = require("../model/posts.model");

const postsController = {
  createPost: async (req, res, next) => {
    const photos = req.files.map(photo => photo.path);
    try {
      const post = new Post({
        postedBy: mongoose.mongo.ObjectId(req.encoded._id),
        content: req.body.content,
        images: photos,
      });
      await post.save();
      return res.send(post);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = postsController;
