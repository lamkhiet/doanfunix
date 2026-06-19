import React, { useEffect, useState } from "react";
import queryString from "query-string";
import OrderAPI from "../API/OrderAPI";
import Pagination from "../Share/Pagination";
import { Link } from "react-router-dom";
import convertMoney from "../convertMoney";

function Orders(props) {
  const [orders, setOrders] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [pagination, setPagination] = useState({
    page: "1",
    count: "8",
    search: "",
  });

  const onChangeText = (e) => {
    setPagination({
      ...pagination,
      page: "1",
      search: e.target.value,
    });
  };

  const handlerChangePage = (value) => {
    setPagination({
      ...pagination,
      page: value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        page: pagination.page,
        count: pagination.count,
        search: pagination.search,
      };

      const query = queryString.stringify(params);
      const newQuery = "?" + query;

      try {
        const response = await OrderAPI.getPagination(newQuery);

        setOrders(response.orders || []);
        setTotalPage(response.totalPage || 1);
        setTotalDocs(response.totalDocs || 0);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
      }
    };

    fetchData();
  }, [pagination]);

  const handlerDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        const response = await OrderAPI.deleteOrder(id);
        alert(response.message);
        setPagination({ ...pagination, page: "1" });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Quản lý Đơn hàng</h4>
                <input
                  className="form-control w-25"
                  onChange={onChangeText}
                  type="text"
                  placeholder="Enter Search!"
                />
                <br />
                <div className="table-responsive">
                  <table className="table table-striped table-bordered no-wrap">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>ID Khách Hàng</th>
                        <th>Tổng Đơn Giá</th>
                        <th>Trạng Thái</th>
                        <th>Thông Tin Vận Chuyển</th>
                        <th>Danh Sách Sản Phẩm</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders &&
                        orders.map((order) => (
                          <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.customerId}</td>
                            <td>{convertMoney(order.totalPrice)} VND</td>
                            <td>{order.status}</td>
                            <td>
                              {
                                <>
                                  <strong>{order.deliveryInfo.fullname}</strong>{" "}
                                  <br />
                                  SĐT: {order.deliveryInfo.phone} <br />
                                  Email: {order.deliveryInfo.email} <br />
                                  ĐC: {order.deliveryInfo.address}
                                </>
                              }
                            </td>
                            <td>
                              {order.products.map((item) => (
                                <div key={item.productId}>
                                  - {item.productId?.name || item.productId} (x
                                  {item.quantity})
                                </div>
                              ))}
                            </td>
                            <td>
                              <Link
                                to={`/orders/update/${order._id}`}
                                className="btn btn-success"
                                style={{ color: "white" }}
                              >
                                Cập Nhật
                              </Link>
                              &nbsp;
                              <button
                                onClick={() => handlerDelete(order._id)}
                                className="btn btn-danger"
                                style={{ color: "white" }}
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <Pagination
                    pagination={pagination}
                    handlerChangePage={handlerChangePage}
                    totalPage={totalPage}
                    totalDocs={totalDocs}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
