import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import convertMoney from "../convertMoney";

function ListCart(props) {
  const { listCart, onDeleteCart, onUpdateCount } = props;

  return (
    <div className="table-responsive mb-4">
      <table className="table">
        <thead className="bg-light">
          <tr className="text-center">
            <th className="border-0" scope="col">
              <strong className="text-small text-uppercase">Hình Ảnh</strong>
            </th>
            <th className="border-0" scope="col">
              <strong className="text-small text-uppercase">Sản Phẩm</strong>
            </th>
            <th className="border-0" scope="col">
              <strong className="text-small text-uppercase">Giá Thành</strong>
            </th>
            <th className="border-0" scope="col">
              <strong className="text-small text-uppercase">Số Lượng</strong>
            </th>
            <th className="border-0" scope="col">
              <strong className="text-small text-uppercase">Tổng Tiền</strong>
            </th>
            <th className="border-0" scope="col">
              <strong className="text-small text-uppercase">Xóa</strong>
            </th>
          </tr>
        </thead>
        <tbody>
          {listCart &&
            listCart.map((value) => {
              const product = value.productId;

              if (!product || typeof product !== "object") return null;

              const currentQuantity = parseInt(value.quantity) || 0;
              const itemPrice = parseInt(value.priceAt || product.price || 0);

              return (
                <tr className="text-center" key={product._id}>
                  <td className="pl-0 border-0">
                    <div className="media align-items-center justify-content-center">
                      <Link
                        className="reset-anchor d-block animsition-link"
                        to={`/products/detail/${product._id}`}
                      >
                        <img
                          src={
                            product?.images?.[0]?.startsWith("http")
                              ? product.images[0]
                              : `http://localhost:5000/images/${product?.images?.[4] || ""}`
                          }
                          alt={product?.name || "Product image"}
                          width="70"
                        />
                      </Link>
                    </div>
                  </td>
                  <td className="align-middle border-0">
                    <div className="media align-items-center justify-content-center">
                      <Link
                        className="reset-anchor h6 animsition-link"
                        to={`/detail/${product._id}`}
                      >
                        {product.name}
                      </Link>
                    </div>
                  </td>
                  <td className="align-middle border-0">
                    <p className="mb-0 small">{convertMoney(itemPrice)} VND</p>
                  </td>
                  <td className="align-middle border-0">
                    <div className="quantity justify-content-center">
                      <button
                        className="dec-btn p-0"
                        onClick={() =>
                          onDeleteCart && currentQuantity === 1
                            ? onDeleteCart(product._id)
                            : onUpdateCount &&
                              onUpdateCount(product._id, currentQuantity - 1)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fas fa-caret-left"></i>
                      </button>
                      <input
                        className="form-control form-control-sm border-0 shadow-0 p-0 text-center"
                        type="text"
                        value={currentQuantity}
                        readOnly
                      />
                      <button
                        className="inc-btn p-0"
                        onClick={() =>
                          onUpdateCount &&
                          onUpdateCount(product._id, currentQuantity + 1)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fas fa-caret-right"></i>
                      </button>
                    </div>
                  </td>
                  <td className="align-middle border-0">
                    <p className="mb-0 small">
                      {convertMoney(itemPrice * currentQuantity)} VND
                    </p>
                  </td>
                  <td className="align-middle border-0">
                    <span
                      className="reset-anchor remove_cart"
                      style={{ cursor: "pointer" }}
                      onClick={() => onDeleteCart && onDeleteCart(product._id)}
                    >
                      <i className="fas fa-trash-alt small text-muted"></i>
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

ListCart.propTypes = {
  listCart: PropTypes.array,
  onDeleteCart: PropTypes.func,
  onUpdateCount: PropTypes.func,
};

export default ListCart;
