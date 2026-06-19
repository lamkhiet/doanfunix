const Customer = require("../models/customer");
const Order = require("../models/order");
const Product = require("../models/product");
const nodemailer = require("nodemailer");

exports.getAll = async (req, res, next) => {
  try {
    const orders = await order.find();

    return res.status(200).json(orders);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCustomerOrder = async (req, res, next) => {
  try {
    const customerId = req.session.customer._id;

    const orders = await Order.find({ customerId: customerId }).sort({
      createdAt: -1,
    });

    return res.status(200).json(orders);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postCreateOrder = async (req, res, next) => {
  const { fullname, email, phone, address } = req.body;

  try {
    const customer = await Customer.findById(req.session.customer._id);

    if (!customer) {
      return res.status(400).json({ message: "Customer Not Found!" });
    }

    if (customer.cart.length === 0) {
      return res.status(400).json({ message: "No Product In Cart!" });
    }

    const cartItems = customer.cart;
    const productsToSave = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Product Not Found!`,
        });
      }

      if (product.status === "Out of Stock") {
        return res.status(400).json({
          message: `Product "${product.name}" Out of Stock!`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Product "${product.name}" Out of Stock. Current Stock: ${product.stock}, Your Quantity: ${item.quantity}`,
        });
      }

      product.stock -= item.quantity;
      productsToSave.push(product);
    }

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.priceAt * item.quantity,
      0,
    );

    const newOrder = new Order({
      customerId: customer._id,
      totalPrice: totalPrice,
      deliveryInfo: {
        fullname: fullname || customer.fullname,
        email: email || customer.email,
        phone: phone || customer.phone,
        address: address || customer.address,
      },
      products: cartItems,
    });

    await newOrder.save();

    for (const product of productsToSave) {
      await product.save();
    }

    customer.cart = [];
    await customer.save();

    // ---- LOGIC GỬI EMAIL BẮT ĐẦU TỪ ĐÂY ----
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: "adminemail@gmail.com",
    //     pass: "xxxx xxxx xxxx xxxx",
    //   },
    // });

    // const mailOptions = {
    //   from: '"E-Shop" <shopemail@gmail.com>',
    //   to: email || customer.email,
    //   subject: "Xác Nhận Đặt Hàng Thành Công ✔",
    //   html: `
    //     <h3>Cảm ơn bạn đã mua sắm tại cửa hàng!</h3>
    //     <p>Mã đơn hàng của bạn là: <b>${newOrder._id}</b></p>
    //     <p>Tổng tiền thanh toán: <b>${totalPrice.toLocaleString()} VND</b></p>
    //     <p>Đơn hàng sẽ được giao đến địa chỉ: ${address || customer.address}</p> // 4. Hiển thị địa chỉ mới nhận từ checkout
    //     <p>Chúc bạn một ngày vui vẻ!</p>
    //   `,
    // };

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.log("Send Email Error:", error);
    //   } else {
    //     console.log("Send Email Successfully: " + info.response);
    //   }
    // });
    // ---- LOGIC GỬI EMAIL KẾT THÚC ----

    res.status(201).json({ message: "Create Order Successfully!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.count) || 8;
  const search = req.query.search || "";

  const options = {
    page: page,
    limit: limit,
  };

  try {
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const result = await Order.paginate(query, options);

    res.json({
      orders: result.docs,
      totalPage: result.totalPages,
      totalDocs: result.totalDocs,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getDetail = async (req, res, next) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({ message: "Order Not Found!" });
    }

    return res.status(200).json(order);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putUpdate = async (req, res, next) => {
  const { orderId } = req.params;
  const { status, deliveryInfo, products, totalPrice } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order Not Found!" });
    }

    if (deliveryInfo) {
      order.deliveryInfo = {
        fullname: deliveryInfo.fullname || order.deliveryInfo.fullname,
        email: deliveryInfo.email || order.deliveryInfo.email,
        phone: deliveryInfo.phone || order.deliveryInfo.phone,
        address: deliveryInfo.address || order.deliveryInfo.address,
      };
    }

    if (products) {
      order.products = products;
    }
    if (totalPrice !== undefined) {
      order.totalPrice = totalPrice;
    }

    if (status !== undefined) {
      if (status === "Cancelled") {
        if (order.status === "Completed") {
          return res.status(400).json({
            message: "Order Completed can't Cancell!",
          });
        }

        if (order.status === "Cancelled") {
          return res.status(400).json({
            message: "Can't Cancel Order Again!",
          });
        }

        const productsToSave = [];
        for (const item of order.products) {
          const product = await Product.findById(item.productId);
          if (product) {
            product.stock += item.quantity;
            productsToSave.push(product);
          }
        }

        for (const product of productsToSave) {
          await product.save();
        }
      }

      order.status = status;
    }

    await order.save();

    res.status(200).json({
      message: "Update Order and Stock Successfully!",
      data: order,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order Not Found!" });
    }

    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: "Delete Order Successfully!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
