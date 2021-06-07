const jwt = require("jsonwebtoken");

const authenToken = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, encoded) => {
      if (error) {
        return next(error);
      }
      req.encoded = encoded;
      next();
    });
  } else {
    return res.status(403).send({ message: "Unauthenticated" });
  }
};

module.exports = authenToken;
