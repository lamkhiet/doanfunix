const { body } = require("express-validator");

exports.createCustomerValidate = [
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
  body("address").trim().notEmpty().withMessage("Địa chỉ không được để trống"),
];

exports.updateCustomerValidate = [
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
  body("address")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Địa chỉ không được để trống"),
  body("status")
    .optional()
    .isIn(["Active", "Locked", "Pending"])
    .withMessage("Trạng thái khách hàng không hợp lệ"),
];
