const express = require("express");
const categoryController = require("../controllers/category");
const { isAdmin, isAuthor } = require("../middleware/auth");
const validateError = require("../middleware/validateError");
const {
  createCategoryValidate,
  updateCategoryValidate,
} = require("../validators/category");

const router = express.Router();

router.get("", categoryController.getAll);

router.get("/pagination", isAuthor, categoryController.getCategories);

router.get("/:categoryId", categoryController.getDetail);

router.post(
  "/update",
  isAuthor,
  updateCategoryValidate,
  validateError,

  categoryController.postUpdate,
);

router.post(
  "/admin/create",
  isAdmin,
  createCategoryValidate,
  validateError,

  categoryController.postCreate,
);

router.delete("/:categoryId", isAdmin, categoryController.deleteCategory);

module.exports = router;
