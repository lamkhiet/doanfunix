import React, { useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomerAPI from "../API/CustomerAPI";
import { AuthContext } from "../Context/AuthContext";

const UpdateCustomer = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const { user: currentUser } = useContext(AuthContext);
  const isAdmin = currentUser && currentUser.role === "Admin";

  const fullnameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const addressRef = useRef();
  const statusRef = useRef();
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await CustomerAPI.getDetail(customerId);

        fullnameRef.current.value = response.fullname;
        emailRef.current.value = response.email;
        phoneRef.current.value = response.phone;
        addressRef.current.value = response.address;
        statusRef.current.value = response.status;
      } catch (error) {
        console.error("Update Error:", error);
        alert("Customer Not Found!");
      }
    };
    fetchUser();
  }, [customerId]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const data = {
      customerId: customerId,
      newPassword: newPasswordRef.current.value,
    };

    let response;
    try {
      if (!isAdmin) {
        data.oldPassword = oldPasswordRef.current.value;
        response = await CustomerAPI.changePassword(data);
      } else {
        response = await CustomerAPI.adminResetPassword(data);
      }

      alert(response.message || "Change Password Successfully!");
      if (oldPasswordRef.current) oldPasswordRef.current.value = "";
      newPasswordRef.current.value = "";
    } catch (error) {
      console.error(error);
      alert("Change Password Failed!");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const data = {
      customerId: customerId,
      fullname: fullnameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      address: addressRef.current.value,
    };

    if (isAdmin) {
      data.status = statusRef.current.value;
    }

    const apiMethod = isAdmin
      ? CustomerAPI.putAdminUpdate
      : CustomerAPI.putUpdate;

    try {
      const response = await apiMethod(data);
      alert(response.message || "Update Customer Successfully!");

      navigate("/users");
    } catch (error) {
      console.error("Update Error:", error);
      alert("Update thất bại, vui lòng kiểm tra lại kết nối.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              Cập nhật Tài khoảng Khách hàng: {customerId}
            </h4>
            <hr />
            <h4 className="card-title mt-4">Đổi mật khẩu / Reset Password</h4>
            <form onSubmit={handleChangePassword}>
              {isAdmin && (
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
                  {isAdmin
                    ? "Mật khẩu mới"
                    : "Đặt lại mật khẩu mới cho Tài khoảng Khách hàng"}
                </label>
                <input
                  type="password"
                  className="form-control"
                  ref={newPasswordRef}
                  required
                  placeholder={
                    isAdmin ? "Nhập mật khẩu mặc định mới" : "Nhập mật khẩu mới"
                  }
                />
              </div>
              <br />
              <button type="submit" className="btn btn-warning">
                {isAdmin
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
                <label>Địa Chỉ</label>
                <input
                  type="text"
                  className="form-control"
                  ref={addressRef}
                  required
                />
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <input
                  type="text"
                  className="form-control"
                  ref={statusRef}
                  required
                  disabled={!isAdmin}
                />
              </div>
              <br />
              <button type="submit" className="btn btn-success">
                Cập Nhật
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/customers")}
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

export default UpdateCustomer;
