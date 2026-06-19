const { body } = require("express-validator");

exports.createOrderValidate = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Tên người nhận không được để trống"),
  body("email").isEmail().withMessage("Email người nhận không hợp lệ"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Số điện thoại người nhận không được để trống")
    .matches(/(^0[3|5|7|8|9])([0-9]{8})\b/)
    .withMessage("Số điện thoại người nhận không đúng định dạng"),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Địa chỉ giao hàng không được để trống"),
];

exports.updateOrderStatusValidate = [
  body("status")
    .isIn([
      "Mới",
      "Đã xác nhận",
      "Đang giao",
      "Đã giao",
      "Hoàn thành",
      "Đã hủy",
    ])
    .withMessage("Trạng thái đơn hàng không hợp lệ"),
];
