const express = require("express");
const orderController = require("../controllers/order");
const { isAdmin, isAuth, isAuthor, isAnyAuth } = require("../middleware/auth");
const validateError = require("../middleware/validateError");
const {
  createOrderValidate,
  updateOrderStatusValidate,
} = require("../validators/order");

const router = express.Router();

router.get("/customerOrder", isAuth, orderController.getCustomerOrder);

router.post(
  "/create",
  isAuth,
  createOrderValidate,
  validateError,
  orderController.postCreateOrder,
);

router.get("/pagination", isAnyAuth, orderController.getOrders);

router.get("/:orderId", isAnyAuth, orderController.getDetail);

router.put(
  "/update/:orderId",
  isAuthor,
  updateOrderStatusValidate,
  validateError,
  orderController.putUpdate,
);

router.delete("/:orderId", isAdmin, orderController.deleteOrder);

module.exports = router;
