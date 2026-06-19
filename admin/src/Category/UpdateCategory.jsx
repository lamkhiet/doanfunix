import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CategoryAPI from "../API/CategoryAPI";

const UpdateCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const nameRef = useRef();
  const descriptionRef = useRef();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await CategoryAPI.getDetail(categoryId);

        nameRef.current.value = response.name;
        descriptionRef.current.value = response.description;
      } catch (error) {
        console.error("Lỗi khi tải thông tin Thương hiệu:", error);
      }
    };
    fetchProduct();
  }, [categoryId]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const data = {
      name: nameRef.current.value,
      description: descriptionRef.current.value,
    };

    try {
      const response = await CategoryAPI.putUpdate(data);
      alert(response.message || "Cập nhật Thương hiệu thành công!");
      navigate("/categories");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại, vui lòng kiểm tra lại logic Server.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Cập nhật Thương hiệu: {categoryId}</h4>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Tên Thương Hiệu</label>
                <input
                  type="text"
                  className="form-control"
                  ref={nameRef}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Mô Tả Thương Hiệu</label>
                <textarea
                  className="form-control"
                  rows="6"
                  ref={descriptionRef}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">
                Cập Nhật
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/categories")}
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

export default UpdateCategory;
