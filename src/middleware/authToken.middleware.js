const jwt = require("jsonwebtoken");
const jsonifyError = require("jsonify-error");

const User = require("../model/user.model");

const authenToken = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, encoded) => {
      if (error) {
        return res.status(403).send(jsonifyError(error));
      }
      User.findById(encoded._id)
        .then(user => {
          if (user === null) {
            return res.status(403).send({ message: "Wrong access-token!" });
          }
          if (user.token !== token) {
            return res.status(403).send({ message: "Unauthenticated access-token" });
          }
          req.encoded = encoded;
          next();
        })
        .catch(err => res.status(400).send(err));
    });
  } else {
    return res.status(403).send({ message: "Unauthenticated" });
  }
};

module.exports = authenToken;
