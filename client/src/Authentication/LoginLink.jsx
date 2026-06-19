import React from "react";
import { Link } from "react-router-dom";

function LoginLink() {
  return (
    <li className="nav-item">
      <Link className="nav-link" to="/signin">
        <i className="fas fa-user-alt mr-1 text-gray"></i>Đăng Nhập
      </Link>
    </li>
  );
}

export default LoginLink;
