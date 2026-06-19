import React, { useRef } from "react";
import CategoryAPI from "../API/CategoryAPI";

const CreateCategory = () => {
  const nameRef = useRef();
  const descriptionRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", nameRef.current.value);
    formData.append("description", descriptionRef.current.value);

    try {
      await CategoryAPI.postCreate(formData);
      alert("Create Category Successfully!");

      e.target.reset();
    } catch (error) {
      console.error("System Error:", error);
      alert("System Error!");
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
              <label>Tên Thương hiệu</label>
              <input
                type="text"
                className="form-control"
                placeholder="VD: iphone, samsung"
                ref={nameRef}
                required
              />
            </div>
            <div className="form-group">
              <label>Mô Tả Thương hiệu</label>
              <textarea
                className="form-control"
                rows="6"
                placeholder="Mô Tả Thương hiệu"
                ref={descriptionRef}
                required
              ></textarea>
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

export default CreateCategory;
