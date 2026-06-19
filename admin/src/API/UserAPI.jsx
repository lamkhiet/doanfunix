import axiosClient from "./axiosClient";

const UserAPI = {
  // getAll: () => {
  //   const url = "/users";
  //   return axiosClient.get(url);
  // },

  postLogin: (data) => {
    const url = "/users/login";
    return axiosClient.post(url, data);
  },

  getPagination: () => {
    const url = "/users/pagination";
    return axiosClient.get(url);
  },

  getDetail: (id) => {
    const url = `/users/${id}`;
    return axiosClient.get(url);
  },
  // postSearch: (searchTerm) => {
  //   const url = "/users/search";
  //   return axiosClient.post(url, { searchTerm });
  // },
  updateUser: (data) => {
    const url = `/users/update`;
    return axiosClient.put(url, data);
  },

  adminUpdate: (data) => {
    const url = `/users/admin/update`;
    return axiosClient.put(url, data);
  },

  changePassword: (data) => {
    const url = `/users/changePassword`;
    return axiosClient.put(url, data);
  },

  adminResetPassword: (data) => {
    const url = `/users/admin/resetPassword`;
    return axiosClient.put(url, data);
  },

  adminCreate: (data) => {
    const url = `/users/admin/create`;
    return axiosClient.post(url, data);
  },

  deleteUser: (id) => {
    const url = `/users/${id}`;
    return axiosClient.delete(url);
  },
};

export default UserAPI;
