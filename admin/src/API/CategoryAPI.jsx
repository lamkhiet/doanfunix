import axiosClient from "./axiosClient";

const CategoryAPI = {
  getAll: () => {
    const url = "/categories";
    return axiosClient.get(url);
  },

  getPagination: () => {
    const url = "/categories/pagination";
    return axiosClient.get(url);
  },

  getDetail: (id) => {
    const url = `/categories/${id}`;
    return axiosClient.get(url);
  },

  putUpdate: (body) => {
    const url = `/categories/update`;
    return axiosClient.put(url, body);
  },

  postCreate: (data) => {
    const url = `/categories/admin/create`;
    return axiosClient.post(url, data);
  },

  deleteCategory: (id) => {
    const url = `/categories/${id}`;
    return axiosClient.delete(url);
  },
};

export default CategoryAPI;
