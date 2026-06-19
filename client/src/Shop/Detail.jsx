import React, { useEffect, useState } from "react";
import ProductAPI from "../API/ProductAPI";
import { Link, useParams } from "react-router-dom";
import alertify from "alertifyjs";
import CartAPI from "../API/CartAPI";
import CategoryAPI from "../API/CategoryAPI";
import convertMoney from "../convertMoney";
import { useAuth } from "../Context/AuthContext";

function Detail(props) {
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState("description");
  const [categoryName, setCategoryName] = useState("");

  const { prodId } = useParams();
  const { customer, dispatch: authDispatch } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ProductAPI.getAll();
        setProducts(response);
      } catch (err) {
        console.error("Lỗi lấy danh sách sản phẩm:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!prodId) return;

    const fetchData = async () => {
      try {
        const response = await ProductAPI.getDetail(prodId);
        if (response) {
          setProduct(response);
          setQuantity(1);

          if (response.category) {
            try {
              const cateResponse = await CategoryAPI.getDetail(
                response.category,
              );
              setCategoryName(cateResponse?.name || response.category);
            } catch (cateErr) {
              console.error("Lỗi lấy chi tiết danh mục:", cateErr);
              setCategoryName(response.category);
            }
          }
        }
      } catch (err) {
        console.error("Lỗi lấy chi tiết sản phẩm:", err);
      }
    };

    fetchData();
  }, [prodId]);

  const increaseQuantity = () => setQuantity(quantity + 1);

  const decreaseQuantity = () => {
    const value = quantity - 1;
    if (value <= 0) return;
    setQuantity(value);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value <= 0) {
      setQuantity(1);
    } else {
      setQuantity(value);
    }
  };

  const handlerReview = (value) => setReview(value);

  const addToCart = async () => {
    alertify.set("notifier", "position", "bottom-left");

    if (customer) {
      try {
        const bodyData = {
          productId: product._id,
          quantity: quantity,
        };

        const response = await CartAPI.addToCart(bodyData);

        if (response && response.cart) {
          authDispatch({ type: "REFRESH_CART", payload: response.cart });
          alertify.success("Bạn Đã Thêm Hàng Thành Công!");
        }
      } catch (err) {
        console.error("Lỗi thêm vào giỏ hàng:", err);
        const errorMsg =
          err.response?.data?.message || "Có lỗi xảy ra khi thêm vào giỏ hàng!";
        alertify.error(errorMsg);
      }
    } else {
      let tempCart = JSON.parse(localStorage.getItem("tempCart")) || [];

      const findProductIndex = tempCart.findIndex(
        (item) => item.productId._id === product._id,
      );

      if (findProductIndex !== -1) {
        tempCart[findProductIndex].quantity += quantity;
      } else {
        const newCartItem = {
          productId: {
            _id: product._id,
            name: product.name,
            price: product.price,
            images: product.images || [],
          },
          quantity: quantity,
        };
        tempCart.push(newCartItem);
      }

      localStorage.setItem("tempCart", JSON.stringify(tempCart));
      alertify.success("Bạn Đã Thêm Hàng Thành Công!");
    }
  };

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
    <section className="py-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-6">
            <div className="row m-sm-0">
              <div className="col-sm-2 p-sm-0 order-2 order-sm-1 mt-2 mt-sm-0">
                <div
                  className="owl-thumbs d-flex flex-row flex-sm-column"
                  data-slider-id="1"
                >
                  <div className="owl-thumb-item flex-fill mb-2 mr-2 mr-sm-0">
                    <img
                      className="w-100"
                      src={
                        product?.images?.[1]?.startsWith("http")
                          ? product.images[1]
                          : `http://localhost:5000/images/${product?.images?.[1] || ""}`
                      }
                      alt={product?.name || "Product image"}
                    />
                  </div>
                  <div className="owl-thumb-item flex-fill mb-2 mr-2 mr-sm-0">
                    <img
                      className="w-100"
                      src={
                        product?.images?.[2]?.startsWith("http")
                          ? product.images[2]
                          : `http://localhost:5000/images/${product?.images?.[2] || ""}`
                      }
                      alt={product?.name || "Product image"}
                    />
                  </div>
                  <div className="owl-thumb-item flex-fill mb-2 mr-2 mr-sm-0">
                    <img
                      className="w-100"
                      src={
                        product?.images?.[3]?.startsWith("http")
                          ? product.images[3]
                          : `http://localhost:5000/images/${product?.images?.[3] || ""}`
                      }
                      alt={product?.name || "Product image"}
                    />
                  </div>
                  <div className="owl-thumb-item flex-fill mb-2 mr-2 mr-sm-0">
                    <img
                      className="w-100"
                      src={
                        product?.images?.[4]?.startsWith("http")
                          ? product.images[4]
                          : `http://localhost:5000/images/${product?.images?.[4] || ""}`
                      }
                      alt={product?.name || "Product image"}
                    />
                  </div>
                </div>
              </div>

              <div
                id="carouselExampleControls"
                className="carousel slide col-sm-10 order-1 order-sm-2"
                data-ride="carousel"
              >
                <div className="carousel-inner owl-carousel product-slider">
                  <div className="carousel-item active">
                    <img
                      className="d-block w-100"
                      src={
                        product?.images?.[1]?.startsWith("http")
                          ? product.images[1]
                          : `http://localhost:5000/images/${product?.images?.[1] || ""}`
                      }
                      alt="First slide"
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      className="d-block w-100"
                      src={
                        product?.images?.[2]?.startsWith("http")
                          ? product.images[2]
                          : `http://localhost:5000/images/${product?.images?.[2] || ""}`
                      }
                      alt="Second slide"
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      className="d-block w-100"
                      src={
                        product?.images?.[3]?.startsWith("http")
                          ? product.images[3]
                          : `http://localhost:5000/images/${product?.images?.[3] || ""}`
                      }
                      alt="Third slide"
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      className="d-block w-100"
                      src={
                        product?.images?.[4]?.startsWith("http")
                          ? product.images[4]
                          : `http://localhost:5000/images/${product?.images?.[4] || ""}`
                      }
                      alt="Fourth slide"
                    />
                  </div>
                </div>
                <Link
                  className="carousel-control-prev"
                  to="#carouselExampleControls"
                  role="button"
                  data-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="sr-only">Previous</span>
                </Link>
                <Link
                  className="carousel-control-next"
                  to="#carouselExampleControls"
                  role="button"
                  data-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="sr-only">Next</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <br />
            <h1>{product.name}</h1>
            <br />
            <p className="text-muted lead">
              {convertMoney(product.price || 0)} VND
            </p>
            <br />
            <p className="text-small mb-4">
              {product?.description
                ?.trim()
                .split(/\s+/)
                .slice(0, 10)
                .join(" ") +
                (product?.description?.trim().split(/\s+/).length > 10
                  ? "..."
                  : "")}
            </p>
            <ul className="list-unstyled small d-inline-block">
              <li className="mb-3 bg-white text-muted">
                <strong className="text-uppercase text-dark">Category:</strong>
                <span className="reset-anchor ml-2">{categoryName}</span>
              </li>
            </ul>
            <div className="row align-items-stretch mb-4">
              <div className="col-sm-5 pr-sm-0">
                <div className="border d-flex align-items-center justify-content-between py-1 px-3 bg-white border-white">
                  <span className="small text-uppercase text-gray mr-4 no-select">
                    Quantity
                  </span>
                  <div className="quantity">
                    <button
                      className="dec-btn p-0"
                      style={{ cursor: "pointer" }}
                      onClick={decreaseQuantity}
                    >
                      <i className="fas fa-caret-left"></i>
                    </button>
                    <input
                      className="form-control border-0 shadow-0 p-0"
                      type="text"
                      value={quantity}
                      onChange={handleQuantityChange}
                    />
                    <button
                      className="inc-btn p-0"
                      style={{ cursor: "pointer" }}
                      onClick={increaseQuantity}
                    >
                      <i className="fas fa-caret-right"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-sm-3 pl-sm-0">
                <button
                  className="btn btn-dark btn-sm btn-block d-flex align-items-center justify-content-center px-0 text-white"
                  onClick={addToCart}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <br />
        <ul className="nav nav-tabs border-0">
          <li className="nav-item">
            <button
              className="nav-link fix_comment border-0"
              onClick={() => handlerReview("description")}
              style={
                review === "description"
                  ? { backgroundColor: "#383838", color: "#ffffff" }
                  : { color: "#383838", backgroundColor: "transparent" }
              }
            >
              Description
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link fix_comment border-0"
              onClick={() => handlerReview("review")}
              style={
                review === "review"
                  ? { backgroundColor: "#383838", color: "#ffffff" }
                  : { color: "#383838", backgroundColor: "transparent" }
              }
            >
              Reviews
            </button>
          </li>
        </ul>

        <div className="tab-content mb-5">
          {review === "description" ? (
            <div className="tab-pane fade show active">
              <div className="pt-4 pb-4 bg-white">
                <h6 className="text-uppercase">Product description </h6>
                <br />
                <p
                  className="text-muted text-small mb-0"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {product.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="tab-pane fade show active">
              <div className="p-4 p-lg-5 bg-white">
                <p className="text-muted small">
                  Hiện tại sản phẩm chưa có đánh giá nào.
                </p>
              </div>
            </div>
          )}
        </div>

        <h2 className="h5 text-uppercase mb-4">Related products</h2>
        <div className="row">
          {products &&
            products
              .filter(
                (el) =>
                  el.category === product.category && el._id !== product._id,
              )
              .map((item) => {
                const isOutOfStock = item.status === "Hết hàng";
                return (
                  <div className="col-lg-3 col-sm-6" key={item._id}>
                    <div
                      className="product text-center skel-loader"
                      style={
                        isOutOfStock
                          ? { pointerEvents: "none", opacity: 0.7 }
                          : {}
                      }
                    >
                      <div className="d-block mb-3 position-relative overflow-hidden">
                        {isOutOfStock && (
                          <div style={outOfStockBadgeStyle}>HẾT HÀNG</div>
                        )}
                        <img
                          className="img-fluid w-100"
                          src={
                            item?.images?.[4]?.startsWith("http")
                              ? item.images[4]
                              : `http://localhost:5000/images/${item?.images?.[4] || ""}`
                          }
                          alt={item?.name || "Product image"}
                        />
                      </div>
                      <h6>
                        <Link
                          className="reset-anchor"
                          to={`/detail/${item._id}`}
                        >
                          {item.name}
                        </Link>
                      </h6>
                      <p className="small text-muted">
                        {convertMoney(item.price || 0)} VND
                      </p>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}

export default Detail;
