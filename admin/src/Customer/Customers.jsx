import React, { useEffect, useState } from "react";
import queryString from "query-string";
import CustomerAPI from "../API/CustomerAPI";
import { Link } from "react-router-dom";
import Pagination from "../Share/Pagination";

function Customers(props) {
  const [customers, setCustomers] = useState([]);
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
        const response = await CustomerAPI.getPagination(newQuery);

        setCustomers(response.customers || []);
        setTotalPage(response.totalPage || 1);
        setTotalDocs(response.totalDocs || 0);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchData();
  }, [pagination]);

  const handleDelete = async (id) => {
    if (window.confirm("Are You Sure?")) {
      try {
        await CustomerAPI.deleteCustomer(id);

        setCustomers((prev) => prev.filter((customer) => customer._id !== id));
        alert("Delete Successfully!");
      } catch (err) {
        console.error(err);
        alert("Delete Failed!");
      }
    }
  };

  return (
    <div className="page-wrapper bg-white min-vh-100 py-4">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                  <h4 className="card-title mb-0 fw-bold text-secondary">
                    Quản lý Tài khoản Khách hàng
                  </h4>
                  <input
                    className="form-control"
                    style={{ maxWidth: "300px" }}
                    type="text"
                    placeholder="Enter Search!"
                    onChange={onChangeText}
                  />
                </div>

                <div className="table-responsive border-0 ">
                  <table className="table table-striped table-hover text-nowrap align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="py-3">ID</th>
                        <th className="py-3">Họ Tên</th>
                        <th className="py-3">Email</th>
                        <th className="py-3">Số Điện Thoại</th>
                        <th className="py-3">Địa Chỉ</th>
                        <th className="py-3">Ngày Tạo</th>
                        <th className="py-3">Ngày Cập Nhật</th>
                        <th className="py-3 text-center">Chỉnh Sửa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers &&
                        customers.map((value) => (
                          <tr key={value._id}>
                            <td className="py-3 text-muted">{value._id}</td>
                            <td className="py-3 fw-semibold">
                              {value.fullname}
                            </td>
                            <td className="py-3">{value.email}</td>
                            <td className="py-3">{value.phone}</td>
                            <td className="py-3">{value.address}</td>
                            <td className="py-3 text-muted">
                              {new Date(value.createdAt).toLocaleDateString(
                                "vi-VN",
                              )}
                            </td>
                            <td className="py-3 text-muted">
                              {new Date(value.updatedAt).toLocaleDateString(
                                "vi-VN",
                              )}
                            </td>
                            <td className="py-3">
                              <div className="d-flex justify-content-center gap-2">
                                <Link
                                  to={`/customers/update/${value._id}`}
                                  className="btn btn-sm btn-success text-white px-3"
                                >
                                  Cập Nhật
                                </Link>
                                <button
                                  onClick={() => handleDelete(value._id)}
                                  className="btn btn-sm btn-danger text-white px-3"
                                >
                                  Xóa
                                </button>
                              </div>
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

export default Customers;
