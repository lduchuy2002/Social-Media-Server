const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  account: {
    type: String,
    min: 6,
    max: 16,
    required: "User name is required",
    unique: true,
  },
  name: {
    type: String,
    min: 6,
    max: 16,
    required: "User name is required",
    unique: true,
  },
  email: {
    type: String,
    min: 6,
    max: 100,
    required: "Email is required",
  },
  password: {
    type: String,
    min: 6,
    max: 16,
    required: "Password is required",
  },
  avatar: {
    type: String,
    required: "Please choose a picture to set your avatar",
  },
  posts: {
    type: Array,
    default: [],
  },
  likes: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
