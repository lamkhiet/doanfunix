import axiosClient from "./axiosClient";

const CartAPI = {
  getCart: () => {
    return axiosClient.get(`/carts`);
  },

  addToCart: (data) => {
    return axiosClient.post(`/carts`, data);
  },

  updateCart: (data) => {
    return axiosClient.put(`/carts`, data);
  },

  deleteFromCart: (productId) => {
    return axiosClient.delete(`/carts/${productId}`);
  },
};

export default CartAPI;
