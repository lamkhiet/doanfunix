const { body } = require("express-validator");

exports.createCategoryValidate = [
  body("name").trim().notEmpty().withMessage("Name is not Empty"),
  body("description").trim().notEmpty().withMessage("Description is not Empty"),
];

exports.updateCategoryValidate = [
  body("name").optional().trim().notEmpty().withMessage("Name is not Empty"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description is not Empty"),
];
