import axios from "axios";
import baseURL from "../config/url";
import Version from "../config/version";

const API = axios.create();

API.defaults.baseURL = baseURL;

API.interceptors.request.use(async (configToMap) => {
  const token = sessionStorage.getItem("token");
  const config = {
    ...configToMap,
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
      Version
    }
  };
  return config;
});

API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response.status === 401) {
      window.location = "/401";
      sessionStorage.clear();
    }
    return Promise.reject(error.response.data);
  }
);

export default API;
