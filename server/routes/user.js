const express = require("express");
const userController = require("../controllers/user");
const User = require("../models/user");
const { loginValidate } = require("../validators/auth");
const validateError = require("../middleware/validateError");
const { isAdmin, isAuth, isAuthor } = require("../middleware/auth");
const {
  createUserValidate,
  updateUserValidate,
} = require("../validators/user");
const { idParamValidate } = require("../validators/delete");

const router = express.Router();

// router.get("", isAuth, userController.getAll);

router.post("/login", loginValidate, validateError, userController.postLogin);

router.get("/pagination", userController.getUsers);

router.get("/:userId", userController.getDetail);

// router.post("/search", userController.postSearch);

router.put(
  "/update/:userId",
  isAuthor,
  updateUserValidate,
  validateError,
  userController.putUpdate,
);

router.put("/changePassword", isAuthor, userController.changePassword);

router.post(
  "/admin/create",
  isAdmin,
  createUserValidate,
  validateError,
  userController.createUser,
);

router.put(
  "/admin/update/:userId",
  isAdmin,
  updateUserValidate,
  validateError,
  userController.adminUpdateUser,
);

router.put("/admin/resetPassword", isAdmin, userController.adminResetPassword);

router.delete(
  "/:userId",
  isAdmin,
  idParamValidate,
  validateError,
  userController.deleteUser,
);

module.exports = router;
