import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerAPI from "../API/CustomerAPI";
import { useAuth } from "../Context/AuthContext";
import "./Auth.css";

function SignIn() {
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    if (!email || !password) return alert("Vui lòng điền đầy đủ thông tin");

    try {
      setError("");
      setLoading(true);
      dispatch({ type: "LOGIN_START" });

      const response = await CustomerAPI.postLogin({ email, password });

      const customerData = response.customer;

      dispatch({ type: "LOGIN_SUCCESS", payload: customerData });
      setLoading(false);

      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Đăng nhập thất bại!";
      dispatch({ type: "LOGIN_FAILURE", payload: msg });
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-50">
          <span className="login100-form-title p-b-33">Sign In</span>

          {error && (
            <div className="text-center pb-3 text-danger">* {error}</div>
          )}

          <div className="wrap-input100 validate-input m-b-16">
            <input
              className="input100"
              type="text"
              placeholder="Email"
              ref={emailRef}
              disabled={loading}
            />
          </div>

          <div className="wrap-input100 validate-input m-b-20">
            <input
              className="input100"
              type="password"
              placeholder="Password"
              ref={passwordRef}
              disabled={loading}
            />
          </div>

          <div className="container-login100-form-btn m-t-20">
            <button
              className="login100-form-btn"
              onClick={onSubmit}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Sign in"}
            </button>
          </div>

          <div className="text-center p-t-45">
            <span className="txt1">Bạn chưa có tài khoản? </span>
            <Link to="/signup" className="txt2 hov1">
              Đăng Ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
