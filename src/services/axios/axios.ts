import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { BACKENDENDPOINT } from "../../utility/env";
import Store from "@/store/store";

const axiosInstance = axios.create({
  baseURL: BACKENDENDPOINT,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?.url?.includes('/user/auth/refresh-token')) {
      return Promise.reject(error);
    }

    if (error.response) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await axiosInstance.post(`/user/auth/refresh-token`);
          return axiosInstance(originalRequest);
        } catch (error) {
          const err = error as AxiosError<any>;
          const message = err?.response?.data?.message;

          Store.getState().clearUser();
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text:
              message === "Refresh token is blacklisted."
                ? "Your session is no longer valid. Please log in again."
                : "You have been logged out. Please contact support.",
            timer: 6000,
            timerProgressBar: true,
            willClose: () => {
              window.location.href = "/";
            },
          });

          if (err?.response) {
            await axiosInstance.post(`/user/auth/logout`);
          }

          return Promise.reject(err);
        }
      }
      else if (error.response.status === 403) {
        Store.getState().clearUser()
        await axiosInstance.post(`/user/auth/logout`);
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "You have been blocked. Please contact support.",
          timer: 6000,
          timerProgressBar: true,
          willClose: () => {
            window.location.href = "/";
          },
        });
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;