import axios from "axios";
import { refreshAccessToken } from "../store/slicers/userSlicer.js";

export const innovaApi = axios.create({
  baseURL: "http://localhost:3000/api",
});

innovaApi.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

innovaApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return Promise.reject(error);

      try {
        const { accessToken } = await store
          .dispatch(refreshAccessToken())
          .unwrap();
        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return innovaApi(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
