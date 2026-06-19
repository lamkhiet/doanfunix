const express = require("express");
const orderController = require("../controllers/order");
const { isAdmin, isAuth, isAuthor } = require("../middleware/auth");
const { idParamValidate } = require("../validators/delete");
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

router.get("/pagination", orderController.getOrders);

router.get("/:orderId", orderController.getDetail);

router.put(
  "/update/:orderId",
  isAuthor,
  updateOrderStatusValidate,
  validateError,
  orderController.putUpdate,
);

router.delete(
  "/:orderId",
  isAdmin,
  idParamValidate,
  validateError,
  orderController.deleteOrder,
);

module.exports = router;
