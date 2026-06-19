import axiosClient from "./axiosClient";

const OrderAPI = {
  postCreate: (data) => {
    const url = "/orders/create";
    return axiosClient.post(url, data);
  },

  getCustomerOrder: () => {
    const url = "/orders/customerOrder";
    return axiosClient.get(url);
  },

  getDetail: (id) => {
    const url = `/orders/${id}`;
    return axiosClient.get(url);
  },

  getPagination: (query) => {
    const url = `/orders/pagination`;
    return axiosClient.get(url);
  },
};

export default OrderAPI;
