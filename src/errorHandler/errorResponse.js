module.exports = function errorResponse(res, message, status = 400) {
  return res.status(status).send({ error: message });
};
