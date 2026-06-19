const express = require("express");
const productController = require("../controllers/product");
const { isAdmin, isAuthor } = require("../middleware/auth");
const {
  createProductValidate,
  updateProductValidate,
} = require("../validators/product");
const validateError = require("../middleware/validateError");
const { idParamValidate } = require("../validators/delete");

const router = express.Router();

router.get("", productController.getAll);

router.get("/pagination", productController.getProducts);

router.get("/:prodId", productController.getDetail);

router.put(
  "/update",
  isAuthor,
  updateProductValidate,
  validateError,
  productController.putUpdate,
);

router.post(
  "/admin/create",
  isAdmin,
  createProductValidate,
  validateError,
  productController.postCreate,
);

router.put(
  "/admin/update",
  isAdmin,
  updateProductValidate,
  validateError,
  productController.putAdminUpdate,
);

router.delete(
  "/:prodId",
  isAdmin,
  idParamValidate,
  validateError,
  productController.deleteProduct,
);

module.exports = router;
