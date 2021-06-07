const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  content: String,
});

const postSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
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
