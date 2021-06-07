const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Post = require("../model/posts.model");

const postsController = {
  createPost: async (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1];
    if (token) {
      //Check valid token or invalid
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, encoded) => {
        if (error) {
          return res.status(403).send(error);
        }

        const photos = req.files.map(photo => photo.path);
        try {
          const post = new Post({
            postedBy: mongoose.mongo.ObjectId("55153a8014829a865bbf700d"),
            content: req.body.content,
            images: photos,
          });
          await post.save();
          return res.send(post);
        } catch (error) {
          next(error);
        }
      });
    } else {
      res.status(403).send("Unauthorize");
    }
  },
};

module.exports = postsController;
