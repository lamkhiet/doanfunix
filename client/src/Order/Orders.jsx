import React, { useEffect, useState } from "react";
import OrderAPI from "../API/OrderAPI";
import { Link } from "react-router-dom";

function Orders(props) {
  const [listCart, setListCart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await OrderAPI.getCustomerOrder();
        setListCart(response);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">Đơn hàng của tôi</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active">Đơn hàng</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <div className="table-responsive pt-5 pb-5">
        <table className="table">
          <thead className="bg-light">
            <tr className="text-center">
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">
                  Mã đơn hàng
                </strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">
                  Người nhận
                </strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">
                  Số điện thoại
                </strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">
                  Địa chỉ giao hàng
                </strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Tổng tiền</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">
                  Trạng thái
                </strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Chi tiết</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {listCart &&
              listCart.map((value) => (
                <tr className="text-center" key={value._id}>
                  <td className="align-middle border-0">
                    <p className="mb-0 small">{value._id}</p>
                  </td>
                  <td className="align-middle border-0">
                    <p className="mb-0 small">{value.deliveryInfo?.fullname}</p>
                  </td>
                  <td className="align-middle border-0">
                    <p className="mb-0 small">{value.deliveryInfo?.phone}</p>
                  </td>
                  <td className="align-middle border-0">
                    <p className="mb-0 small">{value.deliveryInfo?.address}</p>
                  </td>
                  <td className="align-middle border-0">
                    <p className="mb-0 small">${value.totalPrice}</p>{" "}
                  </td>
                  <td className="align-middle border-0">
                    <p className="mb-0 small">
                      <span
                        className={`badge ${value.status === "Mới" ? "bg-warning" : "bg-success"}`}
                      >
                        {value.status}
                      </span>
                    </p>
                  </td>
                  <td className="align-middle border-0">
                    <Link
                      className="btn btn-outline-dark btn-sm"
                      to={`/orders/${value._id}`}
                    >
                      Xem
                      <i className="fas fa-long-arrow-alt-right ml-2"></i>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
