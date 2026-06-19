import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderAPI from "../API/OrderAPI";

const UpdateOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState({
    customerId: "",
    totalPrice: 0,
    status: "Mới",
    deliveryInfo: {
      fullname: "",
      email: "",
      phone: "",
      address: "",
    },
    products: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await OrderAPI.getDetail(orderId);
        setOrder({
          customerId: response.customerId || "",
          totalPrice: response.totalPrice || 0,
          status: response.status || "Mới",
          deliveryInfo: response.deliveryInfo || {
            fullname: "",
            email: "",
            phone: "",
            address: "",
          },
          products: response.products || [],
        });
      } catch (error) {
        console.error("Lỗi khi tải thông tin Đơn hàng:", error);
      }
    };
    fetchProduct();
  }, [orderId]);

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({
      ...prev,
      deliveryInfo: {
        ...prev.deliveryInfo,
        [name]: value,
      },
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await OrderAPI.putUpdate(orderId, order);
      alert(response.message || "Cập nhật đơn hàng thành công!");
      navigate("/orders");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại, vui lòng kiểm tra lại hệ thống.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Cập nhật Đơn hàng: {orderId}</h4>
            <form onSubmit={handleUpdate}>
              <div className="row">
                <div className="form-group col-md-6">
                  <label>ID Khách Hàng</label>
                  <input
                    type="text"
                    className="form-control"
                    value={
                      typeof order.customerId === "object"
                        ? order.customerId._id
                        : order.customerId
                    }
                    disabled
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Trạng Thái Đơn Hàng</label>
                  <select
                    className="form-control"
                    value={order.status}
                    onChange={(e) =>
                      setOrder({ ...order, status: e.target.value })
                    }
                  >
                    <option value="Mới">Mới</option>
                    <option value="Đã xác nhận">Đã xác nhận</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã giao">Đã giao</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </div>
              </div>

              <h5 className="mt-4 text-primary">Thông Tin Giao Hàng</h5>
              <hr />
              <div className="row">
                <div className="form-group col-md-6">
                  <label>Họ và Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fullname"
                    value={order.deliveryInfo.fullname}
                    onChange={handleDeliveryChange}
                    required
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={order.deliveryInfo.email}
                    onChange={handleDeliveryChange}
                    required
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={order.deliveryInfo.phone}
                    onChange={handleDeliveryChange}
                    required
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Địa chỉ nhận hàng</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={order.deliveryInfo.address}
                    onChange={handleDeliveryChange}
                    required
                  />
                </div>
              </div>

              <h5 className="mt-4 text-primary">Danh Sách Sản Phẩm</h5>
              <hr />
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="thead-light">
                    <tr>
                      <th>Mã Sản Phẩm</th>
                      <th>Số Lượng</th>
                      <th>Đơn Giá Lúc Mua</th>
                      <th>Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((item) => (
                      <tr key={item.productId}>
                        <td>{item.productId?.name || item.productId}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            style={{ width: "80px" }}
                            value={item.quantity}
                            disabled
                          />
                        </td>
                        <td>{item.priceAt.toLocaleString()} đ</td>
                        <td>
                          {(item.quantity * item.priceAt).toLocaleString()} đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="form-group text-right mt-3">
                <h5>
                  Tổng Đơn Giá:{" "}
                  <span className="text-danger">
                    {order.totalPrice.toLocaleString()} đ
                  </span>
                </h5>
              </div>

              <button type="submit" className="btn btn-success mr-2">
                Cập Nhật Đơn Hàng
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/orders")}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrder;
