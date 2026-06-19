exports.isAnyAuth = (req, res, next) => {
  const isCustomer =
    req.session && req.session.isCustomerLoggedIn && req.session.customer;
  const isStaff = req.session && req.session.isUserLoggedIn && req.session.user;

  if (!isCustomer && !isStaff) {
    const err = new Error("Please log in!");
    err.statusCode = 401;
    return next(err);
  }

  req.isCustomerRole = !!isCustomer;
  req.isStaffRole = !!isStaff;

  next();
};

exports.isAuth = (req, res, next) => {
  if (
    !req.session ||
    !req.session.isCustomerLoggedIn ||
    !req.session.customer
  ) {
    const err = new Error("Please log in with your Customer Account!");
    err.statusCode = 401;
    throw err;
  }

  next();
};

exports.isAuthor = (req, res, next) => {
  if (!req.session || !req.session.isUserLoggedIn || !req.session.user) {
    const err = new Error("Please log in with your User Account!");
    err.statusCode = 401;
    throw err;
  }

  next();
};

exports.isAdmin = (req, res, next) => {
  if (!req.session.user) {
    const error = new Error("User Not Found!");
    error.statusCode = 401;
    throw error;
  }

  if (req.session.user.role !== "Admin") {
    const error = new Error("No Access!");
    error.statusCode = 403;
    throw error;
  }

  next();
};
