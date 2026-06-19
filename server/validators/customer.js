const { body } = require("express-validator");

exports.createCustomerValidate = [
  body("fullname").trim().notEmpty().withMessage("Fullname is not Empty!"),
  body("email").isEmail().withMessage("Email Invalid").normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must have at least 8 characters!"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is not Empty")
    .matches(/(^0[3|5|7|8|9])([0-9]{8})\b/)
    .withMessage("Phone Invalid (Exa: 0912345678)"),
  body("address").trim().notEmpty().withMessage("Address is not Empty!"),
];

exports.updateCustomerValidate = [
  body("fullname")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Fullname is not Empty"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Email Invalid")
    .normalizeEmail(),
  body("password")
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must have at least 8 characters!"),
  body("phone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Phone is not Empty")
    .matches(/(^0[3|5|7|8|9])([0-9]{8})\b/)
    .withMessage("Phone Invalid"),
  body("address")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Address is not Empty"),
  body("status")
    .optional()
    .isIn(["Active", "Locked", "Pending"])
    .withMessage("Status Invalid"),
];
