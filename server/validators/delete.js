const { body, param } = require("express-validator");

exports.idParamValidate = [
  param("id").isMongoId().withMessage("ID không hợp lệ"),
];
