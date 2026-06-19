import React, { useEffect, useState } from "react";
import queryString from "query-string";
import ProductAPI from "../API/ProductAPI";
import Pagination from "../Share/Pagination";
import convertMoney from "../convertMoney";

function Products(props) {
  const [products, setProducts] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [pagination, setPagination] = useState({
    page: "1",
    count: "8",
    search: "",
    category: "all",
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
        category: pagination.category,
      };

      const query = queryString.stringify(params);
      const newQuery = "?" + query;

      try {
        const response = await ProductAPI.getPagination(newQuery);

        setProducts(response.products || []);
        setTotalPage(response.totalPage || 1);
        setTotalDocs(response.totalDocs || 0);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    fetchData();
  }, [pagination]);

  const handlerDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await ProductAPI.deleteProduct(id);
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
                <h4 className="card-title">Products</h4>
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
                        <th>Tên</th>
                        <th>Thương Hiệu</th>
                        <th>Giá</th>
                        <th>Hình Ảnh</th>
                        <th>Mô Tả</th>
                        <th>Tồn Kho</th>
                        <th>Trạng Thái</th>
                        <th>Chỉnh Sửa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products &&
                        products.map((item) => (
                          <tr key={item._id}>
                            <td>{item._id}</td>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{convertMoney(item.price)} VND</td>
                            <td>
                              <img
                                src={
                                  item?.images?.[4]?.startsWith("http")
                                    ? item.images[4]
                                    : `http://localhost:5000/images/${item?.images?.[4] || ""}`
                                }
                                style={{
                                  height: "60px",
                                  width: "60px",
                                  objectFit: "cover",
                                }}
                                alt={item?.name || "Product image"}
                              />
                            </td>
                            <td>
                              {item?.description
                                ?.trim()
                                .split(/\s+/)
                                .slice(0, 10)
                                .join(" ") +
                                (item?.description?.trim().split(/\s+/).length >
                                10
                                  ? "..."
                                  : "")}
                            </td>
                            <td>{item.stock}</td>
                            <td>{item.status}</td>
                            <td>
                              <a
                                href={`/products/update/${item._id}`}
                                className="btn btn-success"
                                style={{ color: "white" }}
                              >
                                Cập Nhật
                              </a>
                              &nbsp;
                              <button
                                onClick={() => handlerDelete(item._id)}
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

export default Products;
