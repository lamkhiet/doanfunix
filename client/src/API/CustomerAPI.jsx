import axiosClient from "./axiosClient";

const CustomerAPI = {
  postLogin: (data) => {
    const url = "/customers/login";
    return axiosClient.post(url, data);
  },

  postSignUp: (data) => {
    const url = `/customers/signup`;
    return axiosClient.post(url, data);
  },
};

export default CustomerAPI;
