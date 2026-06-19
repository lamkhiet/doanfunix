import axiosClient from "./axiosClient";

const CategoryAPI = {
  getAll: () => {
    const url = "/categories";
    return axiosClient.get(url);
  },

  getDetail: (categoryId) => {
    const url = `/categories/${categoryId}`;
    return axiosClient.get(url);
  },
};

export default CategoryAPI;
