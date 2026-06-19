import React, { useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserAPI from "../API/UserAPI";
import { AuthContext } from "../Context/AuthContext";

const UpdateUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { user: currentUser } = useContext(AuthContext);
  const isAdmin = currentUser && currentUser.role === "Admin";

  const fullnameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const roleRef = useRef();
  const statusRef = useRef();
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await UserAPI.getDetail(userId);

        if (fullnameRef.current)
          fullnameRef.current.value = response.fullname || "";
        if (emailRef.current) emailRef.current.value = response.email || "";
        if (phoneRef.current) phoneRef.current.value = response.phone || "";
        if (roleRef.current) roleRef.current.value = response.role || "Staff";
        if (statusRef.current)
          statusRef.current.value = response.status || "Active";
      } catch (error) {
        console.error("Lỗi khi fetch:", error);

        if (error.response && error.response.status === 404) {
          alert("User không tồn tại!");
        }
      }
    };
    fetchUser();
  }, [userId]);

  const isSelf = currentUser && currentUser._id === userId;

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const data = {
      userId: userId,
      newPassword: newPasswordRef.current.value,
    };

    let response;
    try {
      if (isSelf) {
        data.oldPassword = oldPasswordRef.current.value;
        response = await UserAPI.changePassword(data);
      } else if (isAdmin) {
        response = await UserAPI.adminResetPassword(data);
      } else {
        alert("Bạn không có quyền thực hiện hành động này!");
        return;
      }

      alert(response.message || "Xử lý mật khẩu thành công!");
      if (oldPasswordRef.current) oldPasswordRef.current.value = "";
      newPasswordRef.current.value = "";
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi đổi mật khẩu.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const data = {
      userId: userId,
      fullname: fullnameRef.current.value,
      phone: phoneRef.current.value,
    };

    if (isAdmin) {
      data.role = roleRef.current.value;
      data.status = statusRef.current.value;
    }

    const apiMethod = isAdmin ? UserAPI.adminUpdate : UserAPI.updateUser;

    try {
      const response = await apiMethod(data);
      alert(response.message || "Cập nhật người dùng thành công!");

      navigate("/users");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại, vui lòng kiểm tra lại kết nối.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Update User: {userId}</h4>
            <hr />
            <h4 className="card-title mt-4">Đổi mật khẩu / Reset Password</h4>
            <form onSubmit={handleChangePassword}>
              {isSelf && (
                <div className="form-group">
                  <label>Mật khẩu cũ</label>
                  <input
                    type="password"
                    className="form-control"
                    ref={oldPasswordRef}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>
                  {isSelf ? "Mật khẩu mới" : "Đặt lại mật khẩu mới cho User"}
                </label>
                <input
                  type="password"
                  className="form-control"
                  ref={newPasswordRef}
                  required
                  placeholder={
                    isAdmin && !isSelf
                      ? "Nhập mật khẩu mặc định mới"
                      : "Nhập mật khẩu mới"
                  }
                />
              </div>
              <br />
              <button type="submit" className="btn btn-warning">
                {isSelf
                  ? "Cập nhật mật khẩu"
                  : "Reset Mật Khẩu với quyền Admin"}
              </button>
            </form>

            <br />
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  ref={fullnameRef}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  ref={emailRef}
                  required
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  ref={phoneRef}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quyền tài khoản</label>
                {isAdmin && isSelf ? (
                  <p>Không thể sửa Quyền Admin của tài khoản Admin</p>
                ) : (
                  <select
                    className="form-control"
                    ref={roleRef}
                    disabled={!isAdmin}
                    defaultValue="Staff"
                  >
                    <option value="Staff">Staff</option>
                    <option value="Admin">Admin</option>
                  </select>
                )}
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  className="form-control"
                  ref={statusRef}
                  disabled={!isAdmin}
                  defaultValue="Active"
                >
                  <option value="Active">Active</option>
                  <option value="Locked">Locked</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <br />
              <button type="submit" className="btn btn-success">
                Update User
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/users")}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
