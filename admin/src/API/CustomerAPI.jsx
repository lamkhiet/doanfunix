import axiosClient from "./axiosClient";

const CustomerAPI = {
  getPagination: () => {
    const url = "/customers/pagination";
    return axiosClient.get(url);
  },

  getDetail: (id) => {
    const url = `/customers/${id}`;
    return axiosClient.get(url);
  },

  putUpdate: (data) => {
    const url = `/customers/update}`;
    return axiosClient.put(url, data);
  },

  putAdminUpdate: (data) => {
    const url = `/customers/admin/update`;
    return axiosClient.put(url, data);
  },

  changePassword: (data) => {
    const url = `/customers/changePassword`;
    return axiosClient.put(url, data);
  },

  postCreate: (data) => {
    const url = "/customers/admin/create";

    return axiosClient.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  adminResetPassword: (data) => {
    const url = `/customers/admin/resetPassword`;
    return axiosClient.put(url, data);
  },

  deleteCustomer: (id) => {
    const url = `/customers/${id}`;
    return axiosClient.delete(url);
  },
};

export default CustomerAPI;
