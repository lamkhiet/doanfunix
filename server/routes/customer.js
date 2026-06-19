const express = require("express");
const customerController = require("../controllers/customer");
const { isAdmin, isAuthor } = require("../middleware/auth");
const { idParamValidate } = require("../validators/delete");
const validateError = require("../middleware/validateError");
const {
  createCustomerValidate,
  updateCustomerValidate,
} = require("../validators/customer");

const router = express.Router();

router.post(
  "/signup",
  createCustomerValidate,
  validateError,
  customerController.postCreate,
);

router.post("/login", customerController.postLogin);

router.get("/pagination", customerController.getCustomers);

router.get("/:customerId", isAuthor, customerController.getDetail);

router.put(
  "/update",
  isAuthor,
  updateCustomerValidate,
  validateError,

  customerController.putUpdate,
);

router.put("/changePassword", isAuthor, customerController.changePassword);

router.post("/admin/create", isAdmin, customerController.postCreate);

router.put(
  "/admin/update",
  isAdmin,
  updateCustomerValidate,
  validateError,
  customerController.putAdminUpdate,
);

router.put(
  "/admin/resetPassword",
  isAdmin,
  customerController.adminResetPassword,
);

router.delete(
  "/:customerId",
  isAdmin,
  idParamValidate,
  validateError,
  customerController.deleteCustomer,
);

module.exports = router;
