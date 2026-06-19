const { body } = require("express-validator");

exports.createProductValidate = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên sản phẩm không được để trống"),
  body("price")
    .customSanitizer((value) => {
      const num = parseFloat(value);
      return isNaN(num) ? value : num;
    })
    .isNumeric()
    .withMessage("Giá sản phẩm phải là số")
    .custom((value) => value >= 0)
    .withMessage("Giá sản phẩm không được nhỏ hơn 0"),
  body("images")
    .optional()
    .isArray({ max: 5 })
    .withMessage("Danh sách ảnh phải là mảng và tối đa 5 hình ảnh"),
  // body("images.*")
  //   .optional()
  //   .isString()
  //   .withMessage("Đường dẫn ảnh phải là chuỗi ký tự"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Mô tả sản phẩm không được để trống"),
  body("stock")
    .customSanitizer((value) => {
      const num = parseInt(value);
      return isNaN(num) ? value : num;
    })
    .isInt({ min: 0 })
    .withMessage("Số lượng kho phải là số nguyên và không nhỏ hơn 0"),
];

exports.updateProductValidate = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Tên sản phẩm không được để trống"),
  body("price")
    .customSanitizer((value) => {
      const num = parseFloat(value);
      return isNaN(num) ? value : num;
    })
    .isNumeric()
    .withMessage("Giá sản phẩm phải là số")
    .custom((value) => value >= 0)
    .withMessage("Giá sản phẩm không được nhỏ hơn 0"),
  body("images")
    .optional()
    .isArray({ max: 5 })
    .withMessage("Danh sách ảnh phải là mảng và tối đa 5 hình ảnh"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Mô tả sản phẩm không được để trống"),
  body("stock")
    .customSanitizer((value) => {
      const num = parseInt(value);
      return isNaN(num) ? value : num;
    })
    .isInt({ min: 0 })
    .withMessage("Số lượng kho phải là số nguyên và không nhỏ hơn 0"),
  body("status")
    .optional()
    .isIn(["Còn hàng", "Hết hàng", "Ngừng kinh doanh"])
    .withMessage("Trạng thái sản phẩm không hợp lệ"),
];
