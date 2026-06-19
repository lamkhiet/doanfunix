import axiosClient from "./axiosClient";

const OrderAPI = {
  getPagination: () => {
    const url = "/orders/pagination";
    return axiosClient.get(url);
  },

  getDetail: (id) => {
    const url = `/orders/${id}`;
    return axiosClient.get(url);
  },

  putUpdate: (orderId, body) => {
    const url = `/orders/update/${orderId}`;
    return axiosClient.put(url, body);
  },

  postCreateOrder: (data) => {
    const url = "/order/create";

    return axiosClient.post(url, data);
  },

  deleteOrder: (id) => {
    const url = `/orders/${id}`;
    return axiosClient.delete(url);
  },
};

export default OrderAPI;
