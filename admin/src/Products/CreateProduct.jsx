import React, { useEffect, useRef, useState } from "react";
import ProductAPI from "../API/ProductAPI";
import CategoryAPI from "../API/CategoryAPI";

const CreateProduct = () => {
  const [categories, setCategories] = useState([]);

  const nameRef = useRef();
  const priceRef = useRef();
  const descriptionRef = useRef();
  const stockRef = useRef();
  const statusRef = useRef();
  const fileInputRef = useRef();
  const categoryRef = useRef();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const images = fileInputRef.current.files;

    if (images.length !== 5) {
      alert("5 Images!");
      return;
    }

    const selectedCategoryId = categoryRef.current.value;
    const selectedCategoryObj = categories.find(
      (cat) => cat._id === selectedCategoryId,
    );

    const categoryNameText = selectedCategoryObj
      ? selectedCategoryObj.name
      : "";

    const formData = new FormData();
    formData.append("name", nameRef.current.value);
    formData.append("categoryName", categoryNameText);
    formData.append("description", descriptionRef.current.value);
    formData.append("price", priceRef.current.value);
    formData.append("stock", stockRef.current.value);
    formData.append("status", statusRef.current.value);

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      await ProductAPI.postCreate(formData);
      alert("Create Product Successfully!");

      e.target.reset();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorDetails = error.response.data.errors;

        const message = errorDetails
          .map((err) => `${err.field}: ${err.message}`)
          .join("\n");

        alert(`Error:\n${message}`);
      } else {
        console.error("Error:", error);
        alert("Create Error!");
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <form
            style={{ width: "50%", marginLeft: "40px" }}
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="VD: iPhone 23 Pro Max"
                ref={nameRef}
                required
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                className="form-control"
                placeholder="VD: 20000000"
                ref={priceRef}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                rows="6"
                placeholder="Mô Tả Sản Phẩm"
                ref={descriptionRef}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                min="0"
                className="form-control"
                placeholder="VD: 1"
                ref={stockRef}
                required
              ></input>
            </div>
            <div className="form-group">
              <label>Status</label>

              <select
                className="form-control"
                ref={statusRef}
                defaultValue="In Stock"
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="fileUpload">Images (5 images)</label>
              <input
                type="file"
                className="form-control-file"
                id="fileUpload"
                multiple
                ref={fileInputRef}
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

            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
