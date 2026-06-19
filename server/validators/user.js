const { body } = require("express-validator");

exports.createUserValidate = [
  body("fullname").trim().notEmpty().withMessage("Fullname is not Empty!"),
  body("email").isEmail().withMessage("Email Invalid!").normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must have at least 8 characters!"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is not Empty!")
    .matches(/(^0[3|5|7|8|9])([0-9]{8})\b/)
    .withMessage("Phone Invalid! (Exa: 0912345678)"),
];

exports.updateUserValidate = [
  body("fullname")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Fullname is not Empty!"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Email Invalid!")
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
    .withMessage("Phone is not Empty!")
    .matches(/(^0[3|5|7|8|9])([0-9]{8})\b/)
    .withMessage("Phone Invalid!"),
  body("role").optional().isIn(["Admin", "Staff"]).withMessage("Role Invalid!"),
  body("status")
    .optional()
    .isIn(["Active", "Locked", "Pending"])
    .withMessage("Status Invalid!"),
];
