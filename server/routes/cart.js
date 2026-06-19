const express = require("express");
const cartController = require("../controllers/cart");
const { isAuth } = require("../middleware/auth");

const router = express.Router();

router.get("", isAuth, cartController.getCart);

router.post("", isAuth, cartController.addToCart);

router.put("", isAuth, cartController.updateCart);

router.delete("/:productId", isAuth, cartController.deleteFromCart);

module.exports = router;
