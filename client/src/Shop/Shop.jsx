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
    setSort(value);
  };

  const handlerChangePage = (value) => {
    setPagination({
      page: value,
      count: pagination.count,
      search: pagination.search,
      category: pagination.category,
    });
  };

  const handlerSearch = (value) => {
    setPagination({
      page: pagination.page,
      count: pagination.count,
      search: value,
      category: pagination.category,
    });
  };

  const handlerCategory = (value) => {
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
        console.error("Fetch Error: ", error);
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
