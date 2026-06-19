import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerAPI from "../API/CustomerAPI";
import "./Auth.css";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handlerSignUp = async (e) => {
    e.preventDefault();
    setError("");

    const { fullname, email, password, phone, address } = formData;

    if (!fullname.trim()) return setError("Please Check Your Full Name!");
    if (!email.trim()) return setError("Please Check Your Email!");
    if (!validateEmail(email)) return setError("Incorrect Email Format!");
    if (!password.trim()) return setError("Please Check Your Password!");
    if (!phone.trim()) return setError("Please Check Your Phone Number!");
    if (!address.trim()) return setError("Please Check Your Address!");

    try {
      setLoading(true);

      await CustomerAPI.postSignUp(formData);

      setLoading(false);
      alert("Đăng ký thành công!");
      navigate("/signin");
    } catch (err) {
      setLoading(false);
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "System Error!";
      setError(msg);
    }
  };

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-50">
          <span className="login100-form-title p-b-33">Đăng ký tài khoản</span>

          {error && (
            <div className="text-center pb-4 text-danger font-weight-bold">
              * {error}
            </div>
          )}

          <div className="wrap-input100 validate-input m-b-16">
            <input
              className="input100"
              value={formData.fullname}
              onChange={(e) => handleInputChange(e, "fullname")}
              type="text"
              placeholder="Full Name"
              disabled={loading}
            />
          </div>

          <div className="wrap-input100 rs1 validate-input m-b-16">
            <input
              className="input100"
              value={formData.email}
              onChange={(e) => handleInputChange(e, "email")}
              type="text"
              placeholder="Email"
              disabled={loading}
            />
          </div>

          <div className="wrap-input100 rs1 validate-input m-b-16">
            <input
              className="input100"
              value={formData.password}
              onChange={(e) => handleInputChange(e, "password")}
              type="password"
              placeholder="Password"
              disabled={loading}
            />
          </div>

          <div className="wrap-input100 rs1 validate-input m-b-20">
            <input
              className="input100"
              value={formData.phone}
              onChange={(e) => handleInputChange(e, "phone")}
              type="text"
              placeholder="Phone"
              disabled={loading}
            />
          </div>
          <div className="wrap-input100 rs1 validate-input m-b-20">
            <input
              className="input100"
              value={formData.address}
              onChange={(e) => handleInputChange(e, "address")}
              type="text"
              placeholder="Address"
              disabled={loading}
            />
          </div>

          <div className="container-login100-form-btn m-t-20">
            <button
              className="login100-form-btn"
              onClick={handlerSignUp}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Sign Up"}
            </button>
          </div>

          <div className="text-center p-t-45 p-b-4">
            <span className="txt1">Đăng Nhập?</span>
            &nbsp;
            <Link to="/signin" className="txt2 hov1">
              Đăng Nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
