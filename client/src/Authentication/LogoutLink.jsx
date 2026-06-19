import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function LogoutLink() {
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();

    dispatch({ type: "LOGOUT" });

    navigate("/signin");
  };

  return (
    <Link
      className="nav-item"
      onClick={handleLogout}
      style={{ cursor: "pointer" }}
    >
      <span className="nav-link">( Đăng Xuất )</span>
    </Link>
  );
}

export default LogoutLink;
