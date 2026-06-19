import React, { useEffect, useState } from "react";
import queryString from "query-string";
import Pagination from "../Share/Pagination";
import CategoryAPI from "../API/CategoryAPI";
import { Link } from "react-router-dom";

function Categories(props) {
  const [categories, setCategories] = useState([]);
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
        const response = await CategoryAPI.getPagination(newQuery);

        setCategories(response.categories || []);
        setTotalPage(response.totalPage || 1);
        setTotalDocs(response.totalDocs || 0);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
      }
    };

    fetchData();
  }, [pagination]);

  const handlerDelete = async (id) => {
    if (window.confirm("Bạn có muốn xóa?")) {
      try {
        const response = await CategoryAPI.deleteCategory(id);
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
                <h4 className="card-title">Categories</h4>
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
                        <th>Mô Tả</th>
                        <th>Chỉnh Sửa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories &&
                        categories.map((value) => (
                          <tr key={value._id}>
                            <td>{value._id}</td>
                            <td>{value.name}</td>
                            <td>{value.description}</td>
                            <td>
                              <Link
                                to={`/categories/update/${value._id}`}
                                className="btn btn-success"
                                style={{ color: "white" }}
                              >
                                Update
                              </Link>
                              &nbsp;
                              <button
                                onClick={() => handlerDelete(value._id)}
                                className="btn btn-danger"
                                style={{ color: "white" }}
                              >
                                Delete
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

export default Categories;
