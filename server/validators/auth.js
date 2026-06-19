const { body } = require("express-validator");

exports.loginValidate = [
  body("email").isEmail().withMessage("Email Invalid").normalizeEmail(),
  body("password").trim().notEmpty().withMessage("Password is not Empty"),
];
