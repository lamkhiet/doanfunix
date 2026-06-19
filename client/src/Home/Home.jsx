import React, { useEffect, useState } from "react";
import ProductAPI from "../API/ProductAPI";
import Image from "../Share/img/Image";
import convertMoney from "../convertMoney";
import { Link } from "react-router-dom";

function Home(props) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await ProductAPI.getAll();
      console.log(response);

      const data = response.splice(0, 8);

      setProducts(data);
    };

    fetchData();
  }, []);

  const tempCart = JSON.parse(localStorage.getItem("tempCart")) || [];
  console.log(tempCart);

  const outOfStockBadgeStyle = {
    position: "absolute",
    top: "18px",
    left: "-35px",
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "4px 35px",
    fontSize: "11px",
    fontWeight: "bold",
    transform: "rotate(-45deg)",
    zIndex: 10,
    letterSpacing: "1px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  };

  return (
    <div className="page-holder">
      <div className="container">
        <section
          className="hero pb-3 bg-cover bg-center d-flex align-items-center"
          style={{ backgroundImage: `url(${Image.banner})` }}
        >
          <div className="container py-5">
            <div className="row px-4 px-lg-5">
              <div className="col-lg-6">
                <p className="text-muted small text-uppercase mb-2">
                  New Inspiration 2020
                </p>
                <h1 className="h2 text-uppercase mb-3">
                  20% off on new season
                </h1>
                <a className="btn btn-dark" href="./shop">
                  Browse collections
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="pt-5">
          <header className="text-center">
            <p className="small text-muted small text-uppercase mb-1">
              Carefully created collections
            </p>
            <h2 className="h5 text-uppercase mb-4">Browse our categories</h2>
          </header>
          <div className="row">
            <div className="col-md-12 mb-4">
              <div className="row">
                <div className="col-md-6 mb-4 mb-md-0">
                  <Link className="category-item" to={"/shop?category=iphone"}>
                    <img className="img-fluid" src={Image.img1} alt="" />
                  </Link>
                </div>
                <div className="col-md-6 mb-4 mb-md-0">
                  <Link className="category-item" to={"/shop?category=mac"}>
                    <img className="img-fluid" src={Image.img2} alt="" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="row">
                <div className="col-md-4 mb-4 mb-md-0">
                  <Link className="category-item" to={"/shop?category=ipad"}>
                    <img className="img-fluid" src={Image.img3} alt="" />
                  </Link>
                </div>
                <div className="col-md-4 mb-4 mb-md-0">
                  <Link className="category-item" to={"/shop?category=watch"}>
                    <img className="img-fluid" src={Image.img4} alt="" />
                  </Link>
                </div>
                <div className="col-md-4 mb-4 mb-md-0">
                  <Link className="category-item" to={"/shop?category=airpod"}>
                    <img className="img-fluid" src={Image.img5} alt="" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-5" id="section_product">
          <header>
            <p className="small text-muted small text-uppercase mb-1">
              Made the hard way
            </p>
            <h2 className="h5 text-uppercase mb-4">Top trending products</h2>
          </header>
          <div className="row">
            {products &&
              products.map((item) => {
                const isOutOfStock = item.status === "Hết hàng";
                return (
                  <div className="col-xl-3 col-lg-4 col-sm-6" key={item._id}>
                    <div
                      className="product text-center"
                      style={
                        isOutOfStock
                          ? { pointerEvents: "none", opacity: 0.7 }
                          : {}
                      }
                    >
                      <div className="position-relative mb-3 overflow-hidden">
                        {isOutOfStock && (
                          <div style={outOfStockBadgeStyle}>HẾT HÀNG</div>
                        )}
                        <div className="badge text-white badge-"></div>
                        <img
                          className="img-fluid w-100"
                          src={
                            item?.images?.[4]?.startsWith("http")
                              ? item.images[4]
                              : `http://localhost:5000/images/${item?.images?.[4] || ""}`
                          }
                          alt={item?.name || "Product image"}
                        />
                        <div className="product-overlay">
                          <Link
                            className="btn btn-sm btn-dark"
                            to={`/products/detail/${item._id}`}
                          >
                            Add to cart
                          </Link>
                        </div>
                      </div>
                      <h6>
                        {isOutOfStock ? (
                          <span
                            className="reset-anchor"
                            style={{
                              color: "#6c757d",
                              textDecoration: "none",
                            }}
                          >
                            {item.name}
                          </span>
                        ) : (
                          <Link
                            className="reset-anchor"
                            to={`/products/detail/${item._id}`}
                          >
                            {item.name}
                          </Link>
                        )}
                      </h6>
                      <p className="small text-muted">
                        {convertMoney(item.price)} VND
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row text-center">
              <div className="col-lg-4 mb-3 mb-lg-0">
                <div className="d-inline-block">
                  <div className="media align-items-end">
                    <svg className="svg-icon svg-icon-big svg-icon-light">
                      <use xlinkHref="#delivery-time-1"></use>
                    </svg>
                    <div className="media-body text-left ml-3">
                      <h6 className="text-uppercase mb-1">Free shipping</h6>
                      <p className="text-small mb-0 text-muted">
                        Free shipping worlwide
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mb-3 mb-lg-0">
                <div className="d-inline-block">
                  <div className="media align-items-end">
                    <svg className="svg-icon svg-icon-big svg-icon-light">
                      <use xlinkHref="#helpline-24h-1"> </use>
                    </svg>
                    <div className="media-body text-left ml-3">
                      <h6 className="text-uppercase mb-1">24 x 7 service</h6>
                      <p className="text-small mb-0 text-muted">
                        Free shipping worlwide
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="d-inline-block">
                  <div className="media align-items-end">
                    <svg className="svg-icon svg-icon-big svg-icon-light">
                      <use xlinkHref="#label-tag-1"> </use>
                    </svg>
                    <div className="media-body text-left ml-3">
                      <h6 className="text-uppercase mb-1">Festival offer</h6>
                      <p className="text-small mb-0 text-muted">
                        Free shipping worlwide
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-5">
          <div className="container p-0">
            <div className="row">
              <div className="col-lg-6 mb-3 mb-lg-0">
                <h5 className="text-uppercase">Let's be friends!</h5>
              </div>
              <div className="col-lg-6">
                <form action="#">
                  <div className="input-group flex-column flex-sm-row mb-3">
                    <input
                      className="form-control form-control-lg py-3"
                      type="email"
                      placeholder="Enter your email address"
                      aria-describedby="button-addon2"
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-dark btn-block"
                        id="button-addon2"
                        type="submit"
                      >
                        Subscribe
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
