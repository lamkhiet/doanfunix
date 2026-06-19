const { body } = require("express-validator");

exports.createProductValidate = [
  body("name").trim().notEmpty().withMessage("Name is not Empty!"),
  body("price")
    .customSanitizer((value) => {
      const num = parseFloat(value);
      return isNaN(num) ? value : num;
    })
    .isNumeric()
    .withMessage("Price Invalid!")
    .custom((value) => value >= 0)
    .withMessage("Price > 0"),
  body("images").optional().isArray({ max: 5 }).withMessage("5 Images!!!"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is not Empty!"),
  body("stock")
    .customSanitizer((value) => {
      const num = parseInt(value);
      return isNaN(num) ? value : num;
    })
    .isInt({ min: 0 })
    .withMessage("Stock > 0"),
];

exports.updateProductValidate = [
  body("name").optional().trim().notEmpty().withMessage("Name is not Empty!"),
  body("price")
    .customSanitizer((value) => {
      const num = parseFloat(value);
      return isNaN(num) ? value : num;
    })
    .isNumeric()
    .withMessage("Price Invalid!")
    .custom((value) => value >= 0)
    .withMessage("Price > 0"),
  body("images").optional().isArray({ max: 5 }).withMessage("5 Images!!!"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description is not Empty!"),
  body("stock")
    .customSanitizer((value) => {
      const num = parseInt(value);
      return isNaN(num) ? value : num;
    })
    .isInt({ min: 0 })
    .withMessage("Stock > 0"),
  body("status")
    .optional()
    .isIn(["In Stock", "Out of Stock", "Discontinued"])
    .withMessage("Status Invalid!"),
];
