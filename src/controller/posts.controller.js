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
      const postedById = req.encoded._id.trim()
      const post = new Post({
        postedBy: mongoose.mongo.ObjectId(postedById),
        content: req.body.content,
        images: [...photos],
      });
      await post.save();
      req.user.posts.push(mongoose.mongo.ObjectId(postedById))
      await req.user.save();
      return res.send(post);
    } catch (error) {
      next(error);
    }
  },
  deletePost: async (req, res, next) => {
    const postId = req.params.postId;
    const postedByUser = req.encoded._id;
    req.user.posts = req.user.posts.filter(post=>post.postedBy!==postedByUser);
    await req.save().catch(()=>res.status(500).send({message: "Server Error!"}))
    await Post.findByIdAndDelete(postId)
      .then(post => {
        if (post.postedBy.toString() !== postedByUser) {
          return res.status(403).send({ message: "No right to delete this!" });
        }
        post.images.forEach(path => {
          fs.unlinkSync(path);
        });
      })
      .then(() => res.send({ message: "Deleted post!" }))
      .catch(() => res.status(404).send({ message: "Can not find post's ID" }));
  },
};

module.exports = postsController;
