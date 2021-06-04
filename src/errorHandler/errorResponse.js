module.exports = function errorResponse(res, message, status = 400) {
  res.status(status).send({ error: message });
};
