import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

import LoginLink from "../Authentication/LoginLink";
import LogoutLink from "../Authentication/LogoutLink";
import Name from "../Authentication/Name";

function Header(props) {
  const [active, setActive] = useState("Home");

  const { customer } = useAuth();

  const isLoggedIn = customer !== null;

  const handlerActive = (value) => {
    setActive(value);
    console.log("Tab hiện tại: ", value);
  };

  return (
    <div className="container px-0 px-lg-3">
      <nav className="navbar navbar-expand-lg navbar-light py-3 px-lg-0">
        <Link
          className="navbar-brand"
          to={`/`}
          onClick={() => handlerActive("Home")}
        >
          <span className="font-weight-bold text-uppercase text-dark">
            Boutique
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item" onClick={() => handlerActive("Home")}>
              <Link
                className="nav-link"
                to={`/`}
                style={
                  active === "Home" ? { color: "#dcb14a" } : { color: "black" }
                }
              >
                Trang Chủ
              </Link>
            </li>
            <li className="nav-item" onClick={() => handlerActive("Shop")}>
              <Link
                className="nav-link"
                to={`/shop`}
                style={
                  active === "Shop" ? { color: "#dcb14a" } : { color: "black" }
                }
              >
                Shop
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item" onClick={() => handlerActive("Cart")}>
              <Link className="nav-link" to={`/cart`}>
                <i className="fas fa-dolly-flatbed mr-1 text-gray"></i>
                Giỏ Hàng
              </Link>
            </li>

            {isLoggedIn && <Name />}

            {isLoggedIn ? <LogoutLink /> : <LoginLink />}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Header;
