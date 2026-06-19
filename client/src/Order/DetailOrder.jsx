import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import convertMoney from "../convertMoney";
import OrderAPI from "../API/OrderAPI";

function DetailOrder(props) {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await OrderAPI.getDetail(orderId);
        console.log(response);
        setOrder(response);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchData();
  }, [orderId]);

  if (!order) {
    return <div className="container p-5 text-center">Loading...</div>;
  }

  return (
    <div className="container">
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">Chi tiết đơn hàng</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active">Chi tiết</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <div className="p-5">
        <h1 className="h2 text-uppercase">Thông tin nhận hàng</h1>
        <p>Mã khách hàng: {order.customerId}</p>
        <p>Họ và tên: {order.deliveryInfo?.fullname}</p>
        <p>Số điện thoại: {order.deliveryInfo?.phone}</p>
        <p>Địa chỉ nhận hàng: {order.deliveryInfo?.address}</p>
        <p>
          Trạng thái đơn hàng: <strong>{order.status}</strong>
        </p>
        <p>Tổng tiền thanh toán: {convertMoney(order.totalPrice)} VND</p>
      </div>

      <div className="table-responsive pt-5 pb-5">
        <table className="table">
          <thead className="bg-light">
            <tr className="text-center">
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">
                  Mã sản phẩm
                </strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Hình ảnh</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">
                  Tên sản phẩm
                </strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">
                  Giá gốc tại thời điểm mua
                </strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">
                  Số lượng đặt
                </strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((item, index) => (
              <tr className="text-center" key={index}>
                <td className="align-middle border-0">
                  <h6 className="mb-0">{item.productId}</h6>
                </td>
                <td className="pl-0 border-0">
                  <div className="media align-items-center justify-content-center">
                    <Link
                      className="reset-anchor d-block animsition-link"
                      to={`/products/detail/${item.orderId}`}
                    >
                      <img
                        src={
                          item?.images?.[0]?.startsWith("http")
                            ? item.images[0]
                            : `http://localhost:5000/images/${item?.images?.[4] || ""}`
                        }
                        alt={item?.name || "Product image"}
                        width="200"
                      />
                    </Link>
                  </div>
                </td>
                <td className="align-middle border-0">
                  <h6 className="mb-0">{item.productId?.name}</h6>
                </td>
                <td className="align-middle border-0">
                  <h6 className="mb-0">{convertMoney(item.priceAt)} VND</h6>
                </td>
                <td className="align-middle border-0">
                  <h6 className="mb-0">{item.quantity}</h6>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DetailOrder;
