const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const fs = require("fs");

const Post = require("../model/posts.model");

const postsController = {
  createPost: async (req, res, next) => {
    try {
      let photos = [];
      if (req.files) {
        photos = req.files.map(photo => photo.path);
      }
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
  deletePost: (req, res, next) => {
    const postId = req.body._id;
    Post.findByIdAndDelete(postId)
      .then(post => {
        post.images.forEach(path => {
          fs.unlinkSync(path);
        });
      })
      .then(() => res.send({ message: "Deleted post!" }))
      .catch(() => res.status(404).send({ message: "Can not find post's ID" }));
  },
};

module.exports = postsController;
