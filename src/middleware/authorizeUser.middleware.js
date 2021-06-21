const User = require("../model/user.model");

async function authorUser(req, res, next) {
  const userId = req.encoded._id;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(401).send({ message: "User not found!" });
  }
  if (!user.token.includes(req.token)) {
    return res.status(403).send({ message: "Wrong access-token!" });
  }
  req.user = user;
  return next();
}

module.exports = authorUser;
