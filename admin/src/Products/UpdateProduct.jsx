import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductAPI from "../API/ProductAPI";
import CategoryAPI from "../API/CategoryAPI";
import { AuthContext } from "../Context/AuthContext";

const UpdateProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { user: currentUser } = useContext(AuthContext);
  const isAdmin = currentUser && currentUser.role === "Admin";

  const [categories, setCategories] = useState([]);

  const [oldImages, setOldImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  const nameRef = useRef();
  const categoryRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const stockRef = useRef();
  const statusRef = useRef();

  const IMAGE_BASE_URL = "http://localhost:5000/images/";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await ProductAPI.getDetail(productId);

        nameRef.current.value = response.name;
        descriptionRef.current.value = response.description;
        categoryRef.current.value = response.category;
        priceRef.current.value = response.price;
        stockRef.current.value = response.stock;
        statusRef.current.value = response.status;

        if (response.images) {
          setOldImages(response.images);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin sản phẩm:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CategoryAPI.getAll();
        setCategories(response);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewFiles((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  const removeOldImage = (indexToRemove) => {
    setOldImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const removeNewFile = (indexToRemove) => {
    setNewFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const totalImagesCount = oldImages.length + newFiles.length;
    if (totalImagesCount !== 5) {
      alert(`5 Images!!! (Current: ${totalImagesCount})`);
      return;
    }

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("name", nameRef.current.value);
    formData.append("description", descriptionRef.current.value);
    formData.append("category", categoryRef.current.value);
    formData.append("price", priceRef.current.value);
    formData.append("stock", stockRef.current.value);
    formData.append("status", statusRef.current.value);

    formData.append("remainOldImages", JSON.stringify(oldImages));

    newFiles.forEach((file) => {
      formData.append("images", file);
    });

    const apiMethod = isAdmin
      ? ProductAPI.putAdminUpdate
      : ProductAPI.putUpdate;

    try {
      const response = await apiMethod(formData);
      alert(response.message || "Update Successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Update Error:", error);
      alert("Update Error!");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Update Product: {productId}</h4>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  ref={nameRef}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="form-control" ref={categoryRef} required>
                  <option value="">-- Category --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  className="form-control"
                  ref={priceRef}
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  className="form-control"
                  ref={stockRef}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-control"
                  ref={statusRef}
                  disabled={!isAdmin}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Discontinued">Discontinued</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontWeight: "bold", display: "block" }}>
                  Images (5 images)
                </label>

                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    flexWrap: "wrap",
                    marginBottom: "15px",
                  }}
                >
                  {oldImages.map((imgName, index) => (
                    <div
                      key={`old-${index}`}
                      style={{ position: "relative", textAlign: "center" }}
                    >
                      <img
                        src={`${IMAGE_BASE_URL}${imgName}`}
                        alt="old-product"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          border: "1px solid #ddd",
                        }}
                      />
                      <div style={{ fontSize: "12px", color: "gray" }}>
                        Ảnh cũ
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOldImage(index)}
                        style={{
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
                          background: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          cursor: "pointer",
                          width: "20px",
                          height: "20px",
                          lineHeight: "16px",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {newFiles.map((file, index) => (
                    <div
                      key={`new-${index}`}
                      style={{ position: "relative", textAlign: "center" }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="new-product"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          border: "1px solid #green",
                        }}
                      />
                      <div style={{ fontSize: "12px", color: "green" }}>
                        New image
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewFile(index)}
                        style={{
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
                          background: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          cursor: "pointer",
                          width: "20px",
                          height: "20px",
                          lineHeight: "16px",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <input
                  type="file"
                  className="form-control-file"
                  id="fileUpload"
                  multiple
                  onChange={handleFileChange}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="6"
                  ref={descriptionRef}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-success"
                style={{ marginRight: "10px" }}
              >
                Update
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/products")}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
