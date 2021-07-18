/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  const { errorText, errorCode } = err.message;
  res.status(errorCode || 500);
  res.json(errorText);
}

module.exports = errorHandler;
