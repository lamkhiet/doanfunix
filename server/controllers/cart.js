const Customer = require("../models/Customer");
const Product = require("../models/Product");

exports.getCart = async (req, res, next) => {
  const customerId = req.session.customer._id;
  try {
    const customer =
      await Customer.findById(customerId).populate("cart.productId");

    if (!customer) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy Tài khoản Khách hàng!" });
    }

    res.status(200).json(customer.cart);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  const customerId = req.session.customer._id;
  const { productId } = req.body;
  const quantity = parseInt(req.body.quantity) || 1;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy tài khoản người dùng!" });
    }

    if (!customer.cart) {
      customer.cart = [];
    }

    const cartItemIndex = customer.cart.findIndex(
      (cp) => cp.productId.toString() === productId.toString(),
    );

    const updatedCartItems = [...customer.cart];
    let finalQuantity = quantity;

    if (cartItemIndex >= 0) {
      finalQuantity = customer.cart[cartItemIndex].quantity + quantity;

      if (product.stock < finalQuantity) {
        return res.status(400).json({
          message: `Số lượng trong kho không đủ! (Hiện còn: ${product.stock})`,
        });
      }
      updatedCartItems[cartItemIndex].quantity = finalQuantity;
      updatedCartItems[cartItemIndex].priceAt = product.price;
    } else {
      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Số lượng trong kho không đủ! (Hiện còn: ${product.stock})`,
        });
      }
      updatedCartItems.push({
        productId: productId,
        quantity: quantity,
        priceAt: product.price,
      });
    }

    customer.cart = updatedCartItems;
    await customer.save();

    const updatedCustomer =
      await Customer.findById(customerId).populate("cart.productId");

    return res.status(201).json({
      message: "Thêm Sản phẩm vào Giỏ hàng thành công!",
      cart: updatedCustomer.cart,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.updateCart = async (req, res, next) => {
  const customerId = req.session.customer._id;
  const { productId, newCount } = req.body;
  const newQuantity = parseInt(newCount) || 1;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy tài khoản khách hàng!" });
    }

    const cartItemIndex = customer.cart.findIndex(
      (cp) => cp.productId.toString() === productId,
    );

    if (cartItemIndex === -1) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không có trong Giỏ hàng!" });
    }

    const product = await Product.findById(productId);
    if (product && product.stock < newQuantity) {
      return res.status(400).json({
        message: `Số lượng trong kho không đủ! (Hiện còn: ${product.stock})`,
      });
    }

    customer.cart[cartItemIndex].quantity = newQuantity;
    await customer.save();

    res.status(200).json({ message: "Cập nhật Giỏ hàng thành công!" });
  } catch (err) {
    next(err);
  }
};

exports.deleteFromCart = async (req, res, next) => {
  const customerId = req.session.customer._id;
  const { productId } = req.params;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy tài khoản khách hàng!" });
    }

    customer.cart = customer.cart.filter(
      (item) => item.productId.toString() !== productId,
    );

    await customer.save();
    res.status(200).json({ message: "Xóa Sản phẩm thành công!" });
  } catch (err) {
    next(err);
  }
};
