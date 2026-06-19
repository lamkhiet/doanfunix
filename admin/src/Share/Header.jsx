import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Header(props) {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = (event) => {
    event.preventDefault();

    sessionStorage.removeItem("user");

    dispatch({ type: "LOGOUT" });

    navigate("/login");
  };

  return (
    <header className="topbar" data-navbarbg="skin6">
      <nav className="navbar top-navbar navbar-expand-md">
        <div className="navbar-header" data-logobg="skin6">
          <Link className="navbar-brand" to="/">
            <span className="logo-text">
              <span>Admin Page</span>
            </span>
          </Link>
        </div>

        <div
          className="navbar-collapse collapse justify-content-end"
          id="navbarSupportedContent"
        >
          {/* Phần bên phải: Thông tin User & Logout */}
          <ul className="navbar-nav">
            <li className={`nav-item dropdown ${showDropdown ? "show" : ""}`}>
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="ml-2 d-none d-lg-inline-block">
                  <span>Xin chào,</span>{" "}
                  <span className="text-dark">
                    {user ? user.fullname : "Guest"}
                  </span>
                </span>
              </Link>

              <div
                className={`dropdown-menu dropdown-menu-right user-dd animated flipInY ${showDropdown ? "show" : ""}`}
              >
                <Link
                  className="dropdown-item"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  <i className="mr-2 ml-1 fas fa-power-off"></i>
                  Đăng xuất
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
