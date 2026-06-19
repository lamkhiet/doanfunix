import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function Name() {
  const { customer } = useAuth();

  if (!customer) return null;

  return (
    <li className="nav-item dropdown">
      <Link
        className="nav-link dropdown-toggle"
        style={{ cursor: "pointer" }}
        id="pagesDropdown"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i className="fas fa-user-alt mr-1 text-gray"></i>
        {customer.fullname}
      </Link>
      <div className="dropdown-menu mt-3" aria-labelledby="pagesDropdown">
        <Link className="dropdown-item border-0 transition-link" to="/orders">
          Đơn Hàng
        </Link>
      </div>
    </li>
  );
}

export default Name;
