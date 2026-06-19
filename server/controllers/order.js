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

    if (!customer || customer.cart.length === 0) {
      return res
        .status(400)
        .json({ message: "Giỏ hàng trống hoặc tài khoản không tồn tại!" });
    }

    const cartItems = customer.cart;
    const productsToSave = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Một sản phẩm trong giỏ hàng của bạn không còn tồn tại trên hệ thống!`,
        });
      }

      if (product.status === "Ngừng kinh doanh") {
        return res.status(400).json({
          message: `Sản phẩm "${product.name}" đã ngừng kinh doanh, không thể đặt mua.`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm "${product.name}" không đủ số lượng trong kho. Hiện còn: ${product.stock}, bạn yêu cầu: ${item.quantity}`,
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
    //   to: email || customer.email, // 3. Gửi tới email người dùng nhập tại checkout
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
    //     console.log("Lỗi gửi email:", error);
    //   } else {
    //     console.log("Email đã được gửi thành công: " + info.response);
    //   }
    // });
    // ---- LOGIC GỬI EMAIL KẾT THÚC ----

    res.status(201).json({ message: "Đặt hàng thành công!" });
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
      res.status(404).json({ message: "Đơn hàng không tồn tại!" });
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
      return res.status(404).json({ message: "Đơn hàng không tồn tại!" });
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
      if (status === "Đã hủy") {
        if (order.status === "Hoàn thành") {
          return res.status(400).json({
            message:
              "Không thể hủy đơn hàng này vì đơn hàng đã ở trạng thái Hoàn thành!",
          });
        }

        if (order.status === "Đã hủy") {
          return res.status(400).json({
            message: "Đơn hàng này đã được hủy từ trước, không thể hủy lại!",
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
      message: "Cập nhật chi tiết đơn hàng và đồng bộ kho thành công!",
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
      return res.status(404).json({ message: "Đơn hàng không tồn tại!" });
    }

    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: "Xóa Đơn hàng thành công!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
