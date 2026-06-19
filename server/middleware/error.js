module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  let message = err.message || "Đã xảy ra lỗi hệ thống nghiêm trọng.";

  const errorResponse = {
    success: false,
    statusCode: statusCode,
    message: message,
  };

  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  } else if (statusCode === 500) {
    errorResponse.message = "Lỗi hệ thống nội bộ. Vui lòng thử lại sau.";
  }

  res.status(statusCode).json(errorResponse);
};
