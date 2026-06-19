import axiosClient from "./axiosClient";

const ProductAPI = {
  getAll: () => {
    const url = "/products";
    return axiosClient.get(url);
  },

  getPagination: () => {
    const url = "/products/pagination";
    return axiosClient.get(url);
  },

  // getCategory: (query) => {
  //   const url = `/products/category${query}`;
  //   return axiosClient.get(url);
  // },

  getDetail: (id) => {
    const url = `/products/${id}`;
    return axiosClient.get(url);
  },

  postCreate: (data) => {
    const url = "/products/admin/create";

    return axiosClient.post(url, data);
  },

  putUpdate: (body) => {
    const url = `/products/update`;
    return axiosClient.put(url, body);
  },

  putAdminUpdate: (body) => {
    const url = `/products/admin/update`;
    return axiosClient.put(url, body);
  },

  deleteProduct: (id) => {
    const url = `/products/${id}`;
    return axiosClient.delete(url);
  },
};

export default ProductAPI;
