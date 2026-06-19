const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: "Dữ liệu đầu vào không hợp lệ. Vui lòng kiểm tra lại!",
      errors: error,
    });
  }

  next();
};
