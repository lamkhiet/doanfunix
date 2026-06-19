const { body } = require("express-validator");

exports.createOrderValidate = [
  body("fullname").trim().notEmpty().withMessage("Name is not Empty!"),
  body("email").isEmail().withMessage("Email Invalid!"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is not Empty!")
    .matches(/(^0[3|5|7|8|9])([0-9]{8})\b/)
    .withMessage("Phone Invalid!"),
  body("address").trim().notEmpty().withMessage("Address is not Empty!"),
];

exports.updateOrderStatusValidate = [
  body("status")
    .isIn([
      "New",
      "Confirmed",
      "Delivering",
      "Delivered",
      "Completed",
      "Cancelled",
    ])
    .withMessage("Status Invalid!"),
];
