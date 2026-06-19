const { body } = require("express-validator");

exports.loginValidate = [
  body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Mật khẩu không được để trống"),
];
