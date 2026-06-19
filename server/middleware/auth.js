exports.isAuth = (req, res, next) => {
  if (
    !req.session ||
    !req.session.isCustomerLoggedIn ||
    !req.session.customer
  ) {
    const err = new Error(
      "Vui lòng đăng nhập bằng Tài khoản Khách hàng để thực hiện hành động này.",
    );
    err.statusCode = 401;
    throw err;
  }

  next();
};

exports.isAuthor = (req, res, next) => {
  if (!req.session || !req.session.isUserLoggedIn || !req.session.user) {
    const err = new Error(
      "Vui lòng đăng nhập bằng Tài khoản nhân viên để thực hiện hành động này.",
    );
    err.statusCode = 401;
    throw err;
  }

  next();
};

exports.isAdmin = (req, res, next) => {
  if (!req.session.user) {
    const error = new Error("Không tìm thấy thông tin người dùng.");
    error.statusCode = 401;
    throw error;
  }

  if (req.session.user.role !== "Admin") {
    const error = new Error("Bạn không có quyền truy cập vào tài nguyên này.");
    error.statusCode = 403;
    throw error;
  }

  next();
};
