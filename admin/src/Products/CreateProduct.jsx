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
      alert("Vui lòng upload chính xác **5** hình ảnh!");
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

    console.log("--- Kiểm tra dữ liệu FormData ---");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      await ProductAPI.postCreate(formData);
      alert("Thêm sản phẩm thành công!");

      e.target.reset();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorDetails = error.response.data.errors;

        const message = errorDetails
          .map((err) => `${err.field}: ${err.message}`)
          .join("\n");

        alert(`Lỗi đầu vào:\n${message}`);
      } else {
        console.error("Lỗi hệ thống:", error);
        alert("Đã có lỗi xảy ra, vui lòng kiểm tra lại kết nối.");
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
              <label>Tên Sản Phẩm</label>
              <input
                type="text"
                className="form-control"
                placeholder="VD: iPhone 23 Pro Max"
                ref={nameRef}
                required
              />
            </div>
            <div className="form-group">
              <label>Giá Sản Phẩm</label>
              <input
                type="number"
                className="form-control"
                placeholder="VD: 20000000"
                ref={priceRef}
                required
              />
            </div>

            <div className="form-group">
              <label>Mô Tả Sản Phẩm</label>
              <textarea
                className="form-control"
                rows="6"
                placeholder="Mô Tả Sản Phẩm"
                ref={descriptionRef}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Số Lượng Tồn Kho</label>
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
              <label>Trạng Thái Sản Phẩm</label>

              <select
                className="form-control"
                ref={statusRef}
                defaultValue="Còn hàng"
              >
                <option value="Còn hàng">Còn hàng</option>
                <option value="Hết hàng">Hết hàng</option>
                <option value="Ngừng kinh doanh">Ngừng kinh doanh</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="fileUpload">
                Tải Hình Ảnh Sản Phẩm (5 images)
              </label>
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
              <label>Thương Hiệu</label>
              <select className="form-control" ref={categoryRef} required>
                <option value="">-- Chọn thương hiệu --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
