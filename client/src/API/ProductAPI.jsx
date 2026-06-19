import axiosClient from "./axiosClient";

const ProductAPI = {
  getAll: () => {
    const url = "/products";
    return axiosClient.get(url);
  },

  getDetail: (id) => {
    const url = `/products/${id}`;
    return axiosClient.get(url);
  },

  getPagination: async (query) => {
    const url = `/products/pagination`;

    const response = await axiosClient.get(url, { params: query });

    if (response && response.products) {
      response.products = response.products.filter(
        (product) => product.status !== "Ngừng kinh doanh",
      );
    }

    return response;
  },
};

export default ProductAPI;
