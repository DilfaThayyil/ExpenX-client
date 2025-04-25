import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { BACKENDENDPOINT } from "../../utility/env";
import Store from "@/store/store";

const axiosInstance = axios.create({
  baseURL: BACKENDENDPOINT,
  withCredentials: true,
});

// Log all requests
axiosInstance.interceptors.request.use((config) => {
  console.log("📤 Sending request:", config.method?.toUpperCase(), config.url);
  return config;
});

// Handle responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", response.config.url, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?.url?.includes('/user/auth/refresh-token')) {
      console.warn("🔁 Refresh token request failed. Preventing infinite loop.");
      return Promise.reject(error);
    }

    if (error.response) {
      console.error("❌ Error response:", {
        url: originalRequest?.url,
        status: error.response.status,
        data: error.response.data,
      });

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        console.log("🔐 Token expired. Attempting to refresh token...");

        try {
          await axiosInstance.post(`/user/auth/refresh-token`);
          console.log("✅ Token refreshed. Retrying original request...");
          return axiosInstance(originalRequest);
        } catch (error) {
          const err = error as AxiosError<any>;
          const message = err?.response?.data?.message;
          console.warn("🚫 Token refresh failed:", message);

          if (message === "Refresh token is blacklisted.") {
            console.log("🔒 Refresh token is blacklisted. Forcing logout.");
          }

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
              console.log("↩️ Redirecting to login page...");
              window.location.href = "/";
            },
          });

          if (err?.response) {
            console.log("🔒 Logging out from server...");
            await axiosInstance.post(`/user/auth/logout`);
          }

          return Promise.reject(err);
        }
      }
      else if (error.response.status === 403) {
        console.warn("⛔️ User access is forbidden. Possibly blocked.");
        Store.getState().clearUser();

        console.log("🔒 Logging out due to 403 status...");
        await axiosInstance.post(`/user/auth/logout`);

        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "You have been blocked. Please contact support.",
          timer: 6000,
          timerProgressBar: true,
          willClose: () => {
            console.log("↩️ Redirecting to homepage due to block.");
            window.location.href = "/";
          },
        });

        return Promise.reject(error);
      }
    }

    console.error("❓ Unhandled error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
