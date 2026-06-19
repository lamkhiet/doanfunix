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

const router = express.Router();

router.post("/login", loginValidate, validateError, userController.postLogin);

router.get("/pagination", isAuthor, userController.getUsers);

router.get("/:userId", isAuthor, userController.getDetail);

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

router.delete("/:userId", isAdmin, userController.deleteUser);

module.exports = router;
