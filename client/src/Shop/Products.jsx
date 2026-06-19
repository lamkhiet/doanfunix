import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import convertMoney from "../convertMoney";

Products.propTypes = {
  products: PropTypes.array,
  sort: PropTypes.string,
};

Products.defaultProps = {
  products: [],
  sort: "",
};

function Products(props) {
  const { products, sort } = props;

  const sortedProducts = [...products];

  if (sort === "DownToUp") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "UpToDown") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="row">
      {/* -------------Product----------------- */}
      {sortedProducts &&
        sortedProducts.map((item) => {
          const isOutOfStock = item.status === "Out of Stock";

          return (
            <div className="col-lg-4 col-sm-6 Section_Category" key={item._id}>
              <div
                className="product text-center"
                style={
                  isOutOfStock ? { pointerEvents: "none", opacity: 0.7 } : {}
                }
              >
                <div className="position-relative mb-3 overflow-hidden">
                  {isOutOfStock && (
                    <div style={outOfStockBadgeStyle}>Out of Stock</div>
                  )}

                  {isOutOfStock ? (
                    <div className="d-block">
                      <img
                        className="img-fluid w-100"
                        src={
                          item?.images?.[0]?.startsWith("http")
                            ? item.images[0]
                            : `http://localhost:5000/images/${item?.images?.[4] || ""}`
                        }
                        alt={item?.name || "Product image"}
                      />
                    </div>
                  ) : (
                    <Link
                      className="d-block"
                      to={`/products/detail/${item._id}`}
                    >
                      <img
                        className="img-fluid w-100"
                        src={
                          item?.images?.[0]?.startsWith("http")
                            ? item.images[0]
                            : `http://localhost:5000/images/${item?.images?.[4] || ""}`
                        }
                        alt={item?.name || "Product image"}
                      />
                    </Link>
                  )}

                  {!isOutOfStock && (
                    <div className="product-overlay">
                      <ul className="mb-0 list-inline"></ul>
                    </div>
                  )}
                </div>

                <h6>
                  {isOutOfStock ? (
                    <span
                      className="reset-anchor"
                      style={{ color: "#6c757d", textDecoration: "none" }}
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
      {/* -------------Product----------------- */}
    </div>
  );
}

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

export default Products;
