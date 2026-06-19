/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import queryString from "query-string";
import ProductAPI from "../API/ProductAPI";
import { Link } from "react-router-dom";
import Search from "./Search";
import Pagination from "../Share/Pagination";
import Products from "./Products";
import SortProduct from "./SortProduct";
import convertMoney from "../convertMoney";

function Shop(props) {
  const [products, setProducts] = useState([]);
  const [temp, setTemp] = useState([]);

  const [sort, setSort] = useState("default");

  const [totalPage, setTotalPage] = useState();

  const category =
    new URLSearchParams(window.location.search).get("category") || "all";
  console.log(category);

  const [pagination, setPagination] = useState({
    page: "1",
    count: "9",
    search: "",
    category: category,
  });

  const handlerChangeSort = (value) => {
    console.log("Value: ", value);

    setSort(value);
  };

  const handlerChangePage = (value) => {
    console.log("Value: ", value);

    setPagination({
      page: value,
      count: pagination.count,
      search: pagination.search,
      category: pagination.category,
    });
  };

  const handlerSearch = (value) => {
    console.log("Value: ", value);

    setPagination({
      page: pagination.page,
      count: pagination.count,
      search: value,
      category: pagination.category,
    });
  };

  const handlerCategory = (value) => {
    console.log("Value: ", value);

    setPagination({
      page: pagination.page,
      count: pagination.count,
      search: pagination.search,
      category: value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          page: pagination.page,
          count: pagination.count,
          search: pagination.search,
          category: pagination.category,
        };

        const query = queryString.stringify(params);
        const newQuery = "?" + query;

        const response = await ProductAPI.getPagination(newQuery);

        if (response) {
          setProducts(response.products || []);
          setTemp(response.products || []);

          setTotalPage(response.totalPage);
        }
      } catch (error) {
        console.error("Lỗi khi fetch data: ", error);
      }
    };

    fetchData();
  }, [pagination]);

  return (
    <div className="container">
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">Cửa Hàng</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active" aria-current="page">
                    Cửa Hàng
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* -------------Modal Product----------------- */}
      {products &&
        products.map((value) => (
          <div
            className="modal fade show"
            id={`product_${value._id}`}
            key={value._id}
          >
            <div
              className="modal-dialog modal-lg modal-dialog-centered"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-body p-0">
                  <div className="row align-items-stretch">
                    <div className="col-lg-6 p-lg-0">
                      <img
                        style={{ width: "100%" }}
                        className="product-view d-block h-100 bg-cover bg-center"
                        src={
                          value?.images?.[0]?.startsWith("http")
                            ? value.images[0]
                            : `http://localhost:5000/images/${value?.images?.[4] || ""}`
                        }
                        alt={value?.name || "Product image"}
                        data-lightbox={`product_${value._id}`}
                      />
                      <img className="d-none" href={value.images[1]} alt="" />
                      <img className="d-none" href={value.images[2]} alt="" />
                    </div>
                    <div className="col-lg-6">
                      {/* Để tắt modal phải có class="close" và data-dissmiss="modal" và aria-label="Close" */}
                      <Link
                        className="close p-4"
                        type="button"
                        to="#section_product"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        ×
                      </Link>
                      <div className="p-5 my-md-4">
                        <ul className="list-inline mb-2">
                          <li className="list-inline-item m-0">
                            <i className="fas fa-star small text-warning"></i>
                          </li>
                          <li className="list-inline-item m-0">
                            <i className="fas fa-star small text-warning"></i>
                          </li>
                          <li className="list-inline-item m-0">
                            <i className="fas fa-star small text-warning"></i>
                          </li>
                          <li className="list-inline-item m-0">
                            <i className="fas fa-star small text-warning"></i>
                          </li>
                          <li className="list-inline-item m-0">
                            <i className="fas fa-star small text-warning"></i>
                          </li>
                        </ul>
                        <h2 className="h4">{value.name}</h2>
                        <p className="text-muted">
                          {convertMoney(value.price)} VND
                        </p>
                        <p className="text-small mb-4">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. In ut ullamcorper leo, eget euismod orci. Cum
                          sociis natoque penatibus et magnis dis parturient
                          montes nascetur ridiculus mus. Vestibulum ultricies
                          aliquam convallis.
                        </p>
                        <div className="row align-items-stretch mb-4">
                          <div className="col-sm-5 pl-sm-0 fix_addwish">
                            <Link className="btn btn-dark btn-sm btn-block h-100 d-flex align-items-center justify-content-center px-0">
                              <i className="far fa-heart mr-2"></i>
                              Add Too Wish List
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      {/* -------------Modal Product----------------- */}

      <section className="py-5">
        <div className="container p-0">
          <div className="row">
            <div className="col-lg-3 order-2 order-lg-1">
              <h5 className="text-uppercase mb-4">Categories</h5>
              <div className="py-2 px-4 bg-dark text-white mb-3">
                <strong className="small text-uppercase font-weight-bold">
                  Apple
                </strong>
              </div>
              <ul className="list-unstyled small text-muted pl-lg-4 font-weight-normal">
                <li className="mb-2">
                  <Link
                    className="reset-anchor"
                    to="#"
                    onClick={() => handlerCategory("all")}
                  >
                    All
                  </Link>
                </li>
              </ul>
              <div className="py-2 px-4 bg-light mb-3">
                <strong className="small text-uppercase font-weight-bold">
                  Iphone & Mac
                </strong>
              </div>
              <ul className="list-unstyled small text-muted pl-lg-4 font-weight-normal">
                <li className="mb-2">
                  <Link
                    className="reset-anchor"
                    to="#"
                    onClick={() => handlerCategory("iphone")}
                  >
                    IPhone
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    className="reset-anchor"
                    to="#"
                    onClick={() => handlerCategory("ipad")}
                  >
                    Ipad
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    className="reset-anchor"
                    to="#"
                    onClick={() => handlerCategory("macbook")}
                  >
                    Macbook
                  </Link>
                </li>
              </ul>
              <div className="py-2 px-4 bg-light mb-3">
                <strong className="small text-uppercase font-weight-bold">
                  Wireless
                </strong>
              </div>
              <ul className="list-unstyled small text-muted pl-lg-4 font-weight-normal">
                <li className="mb-2">
                  <Link
                    className="reset-anchor"
                    to="#"
                    onClick={() => handlerCategory("airpod")}
                  >
                    Airpod
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    className="reset-anchor"
                    to="#"
                    onClick={() => handlerCategory("watch")}
                  >
                    Watch
                  </Link>
                </li>
              </ul>
              <div className="py-2 px-4 bg-light mb-3">
                <strong className="small text-uppercase font-weight-bold">
                  Other
                </strong>
              </div>
              <ul className="list-unstyled small text-muted pl-lg-4 font-weight-normal mb-5">
                <li className="mb-2">
                  <Link
                    className="reset-anchor"
                    to="#"
                    onClick={() => handlerCategory("mouse")}
                  >
                    Mouse
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    className="reset-anchor"
                    to="#"
                    onClick={() => handlerCategory("keyboard")}
                  >
                    Keyboard
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    className="reset-anchor"
                    to="#"
                    onClick={() => handlerCategory("other")}
                  >
                    Other
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-9 order-1 order-lg-2 mb-5 mb-lg-0">
              <div className="row mb-3 align-items-center">
                {/* ------------------Search----------------- */}
                <Search handlerSearch={handlerSearch} />
                {/* ------------------Search----------------- */}

                <div className="col-lg-8">
                  <ul className="list-inline d-flex align-items-center justify-content-lg-end mb-0">
                    <li className="list-inline-item">
                      <SortProduct handlerChangeSort={handlerChangeSort} />
                    </li>
                  </ul>
                </div>
              </div>

              <Products products={products} sort={sort} />

              <Pagination
                pagination={pagination}
                handlerChangePage={handlerChangePage}
                totalPage={totalPage}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Shop;
