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
    console.log("error - TTTTTTTTTTTTTTTTTTT : ", error)
    const originalRequest = error.config;

    // 💣 Stop retrying if the failed request is the refresh-token route itself
    if (originalRequest?.url?.includes('/user/auth/refresh-token')) {
      console.warn("🔁 Refresh token request failed. Preventing infinite loop.");
      return Promise.reject(error);
    }

    if (error.response) {
      // 🔒 Access token expired
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          console.log("🔄 Refreshing access token...");
          const { data } = await axiosInstance.post(`/user/auth/refresh-token`);
          console.log("✅ Token refreshed successfully.");
          return axiosInstance(originalRequest);
        } catch (error) {
          const err = error as AxiosError<any>;
          const message = err?.response?.data?.message;

          console.log("❌ Refresh token failed:", message || "Unknown error");

          if (message === "Refresh token is blacklisted.") {
            console.log("🚫 Refresh token is blacklisted. Forcing logout...");
          }

          Store.getState().clearUser();
          console.log("🧹 Store cleared due to refresh failure.");

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
        console.log('❌ User is blocked by admin!');
        Store.getState().clearUser()
        console.log("store cleared due to 403 . Logginh out...")
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
