const { body } = require("express-validator");

exports.createCategoryValidate = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên danh mục không được để trống"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Mô tả danh mục không được để trống"),
];

exports.updateCategoryValidate = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Tên danh mục không được để trống"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Mô tả danh mục không được để trống"),
];
