import axios from "axios";
import { refreshAccessToken } from "../store/slicers/userSlicer";
import store from "../store"; 

export const innovaApi = axios.create({
  baseURL: "http://localhost:3000/api",
});

innovaApi.interceptors.request.use(
  (config) => {
    const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
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

      // Tenta obter o refresh token do cookie
      const refreshToken = document.cookie.split('; ').find(row => row.startsWith('refreshToken='))?.split('=')[1];
      if (!refreshToken) return Promise.reject(error);

      try {
        const { accessToken } = await store
          .dispatch(refreshAccessToken())
          .unwrap();
        document.cookie = `accessToken=${accessToken}; path=/; secure; HttpOnly;`;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return innovaApi(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
