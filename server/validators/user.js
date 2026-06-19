const { body } = require("express-validator");

exports.createUserValidate = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Họ và tên không được để trống"),
  body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Mật khẩu phải có ít nhất 8 ký tự"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Số điện thoại không được để trống")
    .matches(/(^0[3|5|7|8|9])([0-9]{8})\b/)
    .withMessage("Số điện thoại không đúng định dạng (ví dụ: 0912345678)"),
];

exports.updateUserValidate = [
  body("fullname")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Họ và tên không được để trống"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),
  body("password")
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Mật khẩu phải có ít nhất 8 ký tự"),
  body("phone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Số điện thoại không được để trống")
    .matches(/(^0[3|5|7|8|9])([0-9]{8})\b/)
    .withMessage("Số điện thoại không đúng định dạng"),
  body("role")
    .optional()
    .isIn(["Admin", "Staff"])
    .withMessage("Vai trò không hợp lệ"),
  body("status")
    .optional()
    .isIn(["Active", "Locked", "Pending"])
    .withMessage("Trạng thái tài khoản không hợp lệ"),
];
