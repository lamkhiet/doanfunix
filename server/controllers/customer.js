const Customer = require("../models/customer");
const bcrypt = require("bcryptjs");

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email: email });
    if (!customer) {
      return res.status(401).json({ message: "Email Not Found!" });
    }

    const isEqual = await bcrypt.compare(password, customer.password);
    if (!isEqual) {
      return res.status(401).json({ message: "Wrong Password!" });
    }

    if (customer.status === "Locked") {
      return res.status(403).json({ message: "Account Locked By Admin." });
    }

    const sessionCart = req.session.cart || [];
    if (sessionCart.length > 0) {
      sessionCart.forEach((sessionItem) => {
        const cartProductIndex = customer.cart.findIndex((cp) => {
          return cp.productId.toString() === sessionItem.productId.toString();
        });

        if (cartProductIndex >= 0) {
          customer.cart[cartProductIndex].quantity += sessionItem.quantity;
        } else {
          customer.cart.push({
            productId: sessionItem.productId,
            quantity: sessionItem.quantity,
            priceAt: sessionItem.priceAt,
          });
        }
      });

      await customer.save();
      req.session.cart = [];
    }

    req.session.isCustomerLoggedIn = true;
    req.session.customer = {
      _id: customer._id.toString(),
      fullname: customer.fullname,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    };

    return req.session.save((err) => {
      if (err) {
        console.log("Save Session Error:", err);
        return next(err);
      }
      return res.status(200).json({
        message: "Login Successfully!",
        customer: req.session.customer,
      });
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.getCustomers = async (req, res, next) => {
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
      query.fullname = { $regex: search, $options: "i" };
    }

    const result = await Customer.paginate(query, options);

    res.json({
      customers: result.docs,
      totalPage: result.totalPages,
      totalDocs: result.totalDocs,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getDetail = async (req, res, next) => {
  const customerId = req.params.customerId;

  try {
    const customer = await Customer.findById(customerId);

    if (!customer) {
      res.status(404).json({ message: "Customer Not Found!" });
    }

    return res.status(200).json(customer);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postCreate = async (req, res, next) => {
  const { fullname, email, password, phone, address, status } = req.body;
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const customer = new Customer({
      fullname: fullname,
      email: email,
      password: passwordHash,
      phone: phone,
      address: address || "",
      status: status || "Active",
    });

    await customer.save();

    res.status(200).json({ message: "Create Customer Successfully!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.putUpdate = async (req, res, next) => {
  const { customerId, fullname, phone, address } = req.body;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer Not Found!" });
    }

    if (fullname !== undefined) customer.fullname = fullname;
    if (phone !== undefined) customer.phone = phone;
    if (address !== undefined) customer.address = address;

    await customer.save();
    res.status(200).json({ message: "Update Customer Successfully!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  const { customerId, oldPassword, newPassword } = req.body;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).json({ message: "Customer Not Found!" });

    const isMatch = await bcrypt.compare(oldPassword, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong Password!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    customer.password = hashedPassword;

    await customer.save();
    res.status(200).json({ message: "Change Password Successfully!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

// ==================ADMIN=========================

exports.putAdminUpdate = async (req, res, next) => {
  const { customerId, fullname, email, phone, address, status } = req.body;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).json({ message: "Customer Not Found!" });

    if (fullname !== undefined) customer.fullname = fullname;
    if (email !== undefined) customer.email = email;
    if (phone !== undefined) customer.phone = phone;
    if (address !== undefined) customer.address = address;
    if (status !== undefined) customer.status = status;

    await customer.save();
    res.status(200).json({ message: "Update Customer Successfully!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.adminResetPassword = async (req, res, next) => {
  const { customerId, newPassword } = req.body;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).json({ message: "Customer Not Found!" });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    customer.password = hashedPassword;

    await customer.save();
    res.status(200).json({ message: "Reset Password Successfully!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  const customerId = req.params.customerId;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer Not Found!" });
    }

    await Customer.findByIdAndDelete(customerId);
    res.status(200).json({ message: "Delete Customer Successfully!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
