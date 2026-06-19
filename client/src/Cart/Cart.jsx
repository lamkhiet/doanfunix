import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import ListCart from "./ListCart";
import alertify from "alertifyjs";
import CartAPI from "../API/CartAPI";
import convertMoney from "../convertMoney";

function Cart() {
  const { customer, dispatch } = useAuth();
  console.log(customer);
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const calculateTotal = useCallback((cartItems) => {
    const subTotal = cartItems.reduce((acc, item) => {
      const price = parseInt(item.priceAt || item.productId?.price || 0);
      const quantity = parseInt(item.quantity || 0);
      return acc + price * quantity;
    }, 0);
    setTotal(subTotal);
  }, []);

  useEffect(() => {
    const fetchCartData = async () => {
      if (customer) {
        try {
          const response = await CartAPI.getCart();
          setCart(response);
          calculateTotal(response);

          dispatch({ type: "REFRESH_CART", payload: response });
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu giỏ hàng từ máy chủ:", error);
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem("tempCart")) || [];
        setCart(localCart);
        calculateTotal(localCart);
      }
    };

    fetchCartData();
  }, [customer, calculateTotal, dispatch]);

  const onDeleteCart = async (productId) => {
    alertify.set("notifier", "position", "bottom-left");

    if (customer) {
      try {
        await CartAPI.deleteFromCart(productId);

        const updatedCart = cart.filter(
          (item) => item.productId._id !== productId,
        );
        setCart(updatedCart);
        calculateTotal(updatedCart);
        dispatch({ type: "REFRESH_CART", payload: updatedCart });
        alertify.error("Xóa thành công sản phẩm khỏi giỏ hàng!");
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        alertify.error(
          error.response?.data?.message || "Có lỗi xảy ra khi xóa!",
        );
      }
    } else {
      const updatedCart = cart.filter(
        (item) => item.productId._id !== productId,
      );
      localStorage.setItem("temp_cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      calculateTotal(updatedCart);
      alertify.error("Xóa thành công sản phẩm khỏi giỏ hàng!");
    }
  };

  const onUpdateCount = async (productId, newCount) => {
    if (customer) {
      try {
        const updateData = { productId, newCount };
        await CartAPI.updateCart(updateData);

        const updatedCart = cart.map((item) =>
          item.productId._id === productId
            ? { ...item, quantity: newCount }
            : item,
        );

        setCart(updatedCart);
        calculateTotal(updatedCart);
        dispatch({ type: "REFRESH_CART", payload: updatedCart });
      } catch (error) {
        console.error("Lỗi cập nhật số lượng:", error);
        alertify.error(
          error.response?.data?.message || "Số lượng kho không đủ!",
        );
      }
    } else {
      const updatedCart = cart.map((item) =>
        item.productId._id === productId
          ? { ...item, quantity: newCount }
          : item,
      );
      localStorage.setItem("temp_cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      calculateTotal(updatedCart);
    }
  };

  const onCheckout = () => {
    alertify.set("notifier", "position", "bottom-left");
    if (!customer) {
      alertify.error("Vui lòng đăng nhập trước khi tiến hành thanh toán!");
      return;
    }
    if (cart.length === 0) {
      alertify.error("Giỏ hàng của bạn hiện đang trống!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="container">
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">Giỏ Hàng</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active" aria-current="page">
                    Giỏ Hàng
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <h2 className="h5 text-uppercase mb-4">Giỏ Hàng</h2>
        <div className="row">
          <div className="col-lg-8 mb-4 mb-lg-0">
            <ListCart
              listCart={cart}
              onDeleteCart={onDeleteCart}
              onUpdateCount={onUpdateCount}
            />

            <div className="bg-light px-4 py-3">
              <div className="row align-items-center text-center">
                <div className="col-md-6 mb-3 mb-md-0 text-md-left">
                  <Link
                    className="btn btn-link p-0 text-dark btn-sm"
                    to="/shop"
                  >
                    <i className="fas fa-long-arrow-alt-left mr-2"></i>Tiếp tục
                    mua sắm
                  </Link>
                </div>
                <div className="col-md-6 text-md-right">
                  <span
                    className="btn btn-outline-dark btn-sm"
                    onClick={onCheckout}
                    style={{ cursor: "pointer" }}
                  >
                    Tiến hành thanh toán{" "}
                    <i className="fas fa-long-arrow-alt-right ml-2"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 rounded-0 p-lg-4 bg-light">
              <div className="card-body">
                <h5 className="text-uppercase mb-4">Tổng hóa đơn</h5>
                <ul className="list-unstyled mb-0">
                  <li className="d-flex align-items-center justify-content-between">
                    <strong className="text-uppercase small font-weight-bold">
                      Tạm tính
                    </strong>
                    <span className="text-muted small">
                      {convertMoney(total)} VND
                    </span>
                  </li>
                  <li className="border-bottom my-2"></li>
                  <li className="d-flex align-items-center justify-content-between mb-4">
                    <strong className="text-uppercase small font-weight-bold">
                      Tổng tiền
                    </strong>
                    <span>{convertMoney(total)} VND</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Cart;
