import React, { useEffect, useState } from "react";
import CartAPI from "../API/CartAPI";
import OrderAPI from "../API/OrderAPI";
import convertMoney from "../convertMoney";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Checkout() {
  const savedCustomer = JSON.parse(sessionStorage.getItem("customer")) || {};

  const [carts, setCarts] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [fullname, setFullname] = useState(savedCustomer.fullname || "");
  const [email, setEmail] = useState(savedCustomer.email || "");
  const [phone, setPhone] = useState(savedCustomer.phone || "");
  const [address, setAddress] = useState(savedCustomer.address || "");

  const [errors, setErrors] = useState({
    fullname: false,
    email: false,
    emailRegex: false,
    phone: false,
    address: false,
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await CartAPI.getCart();
        setCarts(response || []);
        calculateTotal(response || []);
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
      }
    };
    fetchCart();
  }, []);

  const calculateTotal = (cartList) => {
    const subTotal = cartList.reduce((sum, item) => {
      const price = parseInt(item.productId?.price || 0);
      const quantity = parseInt(item.quantity || 0);
      return sum + price * quantity;
    }, 0);
    setTotal(subTotal);
  };

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validateForm = () => {
    const newErrors = {
      fullname: !fullname,
      email: !email,
      emailRegex: email ? !validateEmail(email) : false,
      phone: !phone,
      address: !address,
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((hasError) => hasError);
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const orderData = {
        fullname,
        email,
        phone,
        address,
        carts,
      };

      const response = await OrderAPI.postCreate(orderData);

      if (response) {
        const userId = savedCustomer._id || localStorage.getItem("userId");
        socket.emit("send_order", userId);

        setSuccess(true);
        setCarts([]);
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert(
        error.response?.data?.message || "Đặt hàng thất bại, vui lòng thử lại!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="wrapper_loader">
          <div className="loader"></div>
        </div>
      )}

      <div className="container">
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
              <div className="col-lg-6">
                <h1 className="h2 text-uppercase mb-0">Checkout</h1>
              </div>
            </div>
          </div>
        </section>

        {!success ? (
          <section className="py-5">
            <h2 className="h5 text-uppercase mb-4">Billing details</h2>
            <div className="row">
              <div className="col-lg-8">
                <form onSubmit={handlerSubmit}>
                  <div className="row">
                    <div className="col-lg-12 form-group mb-3">
                      <label className="text-small text-uppercase">
                        Full Name:
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        type="text"
                        placeholder="Enter Your Full Name Here!"
                      />
                      {errors.fullname && (
                        <span className="text-danger">
                          * Please Check Your Full Name!
                        </span>
                      )}
                    </div>

                    <div className="col-lg-12 form-group mb-3">
                      <label className="text-small text-uppercase">
                        Email:
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        placeholder="Enter Your Email Here!"
                      />
                      {errors.email && (
                        <span className="text-danger">
                          * Please Check Your Email!
                        </span>
                      )}
                      {errors.emailRegex && (
                        <span className="text-danger">
                          * Incorrect Email Format
                        </span>
                      )}
                    </div>

                    <div className="col-lg-12 form-group mb-3">
                      <label className="text-small text-uppercase">
                        Phone Number:
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="text"
                        placeholder="Enter Your Phone Number Here!"
                      />
                      {errors.phone && (
                        <span className="text-danger">
                          * Please Check Your Phone Number!
                        </span>
                      )}
                    </div>

                    <div className="col-lg-12 form-group mb-4">
                      <label className="text-small text-uppercase">
                        Address:
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        type="text"
                        placeholder="Enter Your Address Here!"
                      />
                      {errors.address && (
                        <span className="text-danger">
                          * Please Check Your Address!
                        </span>
                      )}
                    </div>

                    <div className="col-lg-12 form-group">
                      <button className="btn btn-dark btn-lg" type="submit">
                        Place order
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="col-lg-4">
                <div className="card border-0 rounded-0 p-lg-4 bg-light">
                  <div className="card-body">
                    <h5 className="text-uppercase mb-4">Your order</h5>
                    <ul className="list-unstyled mb-0">
                      {carts.map((value) => (
                        <div key={value._id || value.productId?._id}>
                          <li className="d-flex align-items-center justify-content-between">
                            <strong className="small font-weight-bold">
                              {value.productId?.name || "Sản phẩm"}
                            </strong>
                            <span className="text-muted small">
                              {convertMoney(value.productId?.price || 0)} VND x
                              {value.quantity}
                              {value.count}
                            </span>
                          </li>
                          <li className="border-bottom my-2"></li>
                        </div>
                      ))}
                      <li className="d-flex align-items-center justify-content-between">
                        <strong className="text-uppercase small font-weight-bold">
                          Total
                        </strong>
                        <span className="font-weight-bold">
                          {convertMoney(total)} VND
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="py-5 text-center">
            <div className="p-5 bg-light rounded shadow-sm">
              <h1 className="text-success mb-3">
                You Have Successfully Ordered!
              </h1>
              <p style={{ fontSize: "1.2rem" }}>
                Please Check Your Email for order details.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Checkout;
