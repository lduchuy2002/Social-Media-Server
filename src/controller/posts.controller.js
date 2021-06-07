const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Post = require("../model/posts.model");

const postsController = {
  createPost: async (req, res, next) => {
    const token = req.headers["Authorization"].split(" ")[1];
    if (token) {
      //Check valid token or invalid
      jwt
        .verify(token, process.env.ACCESS_TOKEN_SECRET, (error, encoded) => {
          if (error) {
            return res.status(403).send(error);
          }
          const photos = req.file.map(photo => photo.path);
          const post = new Post({
            postedBy: mongoose.mongo.ObjectId(encoded._id),
            content: req.body.content,
            images: photos,
          });
        })
        .save()
        .then(res.json)
        .catch(next);
    }
  },
};

module.exports = postsController;
