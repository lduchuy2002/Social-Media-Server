const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: "userSchema",
  },
  content: String,
});

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: "userSchema",
  },
  content: {
    type: String,
    max: 2000,
  },
  images: {
    type: Array,
    default: [],
  },
  likes: {
    type: Array,
    default: [],
  },
  comment: [commentSchema],
});

module.exports = mongoose.model("Post", postSchema);
