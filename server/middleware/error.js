module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  let message = err.message || "System Error!";

  const errorResponse = {
    success: false,
    statusCode: statusCode,
    message: message,
  };

  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  } else if (statusCode === 500) {
    errorResponse.message = "System Error!";
  }

  res.status(statusCode).json(errorResponse);
};
