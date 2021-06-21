const jwt = require("jsonwebtoken");
const jsonifyError = require("jsonify-error");

const authenToken = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, encoded) => {
      if (error) {
        return res.status(403).send(jsonifyError(error));
      }
      req.token = token;
      req.encoded = encoded;
      next();
    });
  } else {
    return res.status(403).send({ message: "Access-token required!" });
  }
};

module.exports = authenToken;
