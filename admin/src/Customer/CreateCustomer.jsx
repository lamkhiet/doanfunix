import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import CustomerAPI from "../API/CustomerAPI";

const CreateCustomer = () => {
  const navigate = useNavigate();

  const fullnameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();
  const addressRef = useRef();
  const statusRef = useRef();

  const handleCreate = async (e) => {
    e.preventDefault();

    const data = {
      fullname: fullnameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      phone: phoneRef.current.value,
      address: addressRef.current.value,
      status: statusRef.current.value,
    };

    try {
      const response = await CustomerAPI.postCreate(data);
      alert(response.message || "Create Customer Successfully!");
      navigate("/customers");
    } catch (error) {
      console.error("Create Customer Error:", error);
      alert("Create Customer Failed!");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              Tạo Tài khoản Khách hàng (Admin Only)
            </h4>
            <br />
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Họ Tên</label>
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
                <label>Mật Khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Mật khẩu phải có ít nhất 8 ký tự"
                  ref={passwordRef}
                  required
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Số điện thoại Việt Nam. VD: 090xxxxxxx"
                  ref={phoneRef}
                  required
                />
              </div>
              <div className="form-group">
                <label>Địa Chỉ</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="VD: 12/33 Lê Thánh Tôn"
                  ref={addressRef}
                  required
                />
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  className="form-control"
                  ref={statusRef}
                  defaultValue="Active"
                >
                  <option value="Active">Active</option>
                  <option value="Locked">Locked</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <br />
              <button type="submit" className="btn btn-success">
                Tạo Mới
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

export default CreateCustomer;
