const bcrypt = require("bcryptjs");
const User = require("../models/user");

// exports.getAll = async (req, res, next) => {
//   try {
//     const users = await User.find();

//     return res.status(200).json(users);
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }

//     next(err);
//   }
// };

exports.getUsers = async (req, res, next) => {
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

    const result = await User.paginate(query, options);

    res.json({
      users: result.docs,
      totalPage: result.totalPages,
      totalDocs: result.totalDocs,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getDetail = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại!" });
    }

    return res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Email không tồn tại!" });
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res.status(401).json({ message: "Sai mật khẩu!" });
    }

    if (user.status === "Locked") {
      return res
        .status(403)
        .json({ message: "Tài khoản của bạn đã bị khóa bởi Admin." });
    }

    req.session.isUserLoggedIn = true;
    req.session.user = {
      _id: user._id.toString(),
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    };

    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error("Lỗi khi lưu session:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    res.status(200).json({
      userId: user._id.toString(),
      fullname: user.fullname,
      role: user.role,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.putUpdate = async (req, res, next) => {
  const userId = req.params.userId;
  const { fullname, phone } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại!" });
    }

    if (fullname !== undefined) user.fullname = fullname;
    if (phone !== undefined) user.phone = phone;

    await user.save();
    res.status(200).json({ message: "Cập nhật user thành công!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    if (req.user.id !== userId) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền đổi mật khẩu của người khác!" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User không tồn tại!" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không chính xác!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;

    await user.save();
    res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

// ============================= ADMIN =============================
exports.createUser = async (req, res, next) => {
  const { fullname, email, password, phone, staff, status } = req.body;
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = new User({
      fullname: fullname,
      email: email,
      password: passwordHash,
      phone: phone,
      staff: staff,
      status: status,
    });

    await user.save();

    res.status(200).json({ message: "Tạo tài khoản nhân viên thành công!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.adminUpdateUser = async (req, res, next) => {
  const userId = req.params.userId;
  const { fullname, email, phone, role, status } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User không tồn tại!" });

    if (fullname !== undefined) user.fullname = fullname;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (role !== undefined) user.role = role;
    if (status !== undefined) user.status = status;

    await user.save();
    res.status(200).json({ message: "Admin cập nhật User thành công!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.adminResetPassword = async (req, res, next) => {
  const { userId, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User không tồn tại!" });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;

    await user.save();
    res.status(200).json({ message: "Admin đã đặt lại mật khẩu thành công!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại!" });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Xóa user thành công!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
