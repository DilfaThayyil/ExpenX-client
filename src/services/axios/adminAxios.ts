import axios from "axios";
import Swal from "sweetalert2";
import { BACKENDENDPOINT } from "@/utility/env";
import useAdminStore from "@/store/adminStore";

const axiosInstance = axios.create({
  baseURL: BACKENDENDPOINT,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { clearAdminEmail } = useAdminStore.getState();

    if (originalRequest?.url?.includes("/admin/refresh-token")) {
      console.warn("🛑 Refresh token request failed. Preventing infinite loop.");
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const errorMessage = error.response?.data?.message || "";

      if (errorMessage === "Refresh token expired" || errorMessage === "Refresh token is blacklisted.") {
        clearAdminEmail();

        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please login again.",
          timer: 6000,
          timerProgressBar: true,
          willClose: () => {
            window.location.href = "/admin/login";
          },
        });

        try {
          await axiosInstance.post("/admin/logout");
        } catch (logoutErr) {
          console.error("Logout failed:", logoutErr);
        }

        return Promise.reject(error);
      }

      try {
        await axiosInstance.post(`/admin/refresh-token`);
        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        const errorMessage = refreshError?.response?.data?.message || "";

        clearAdminEmail();

        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: errorMessage === "Refresh token is blacklisted."
            ? "Your session is no longer valid. Please login again."
            : "Please login again.",
          timer: 6000,
          timerProgressBar: true,
          willClose: () => {
            window.location.href = "/admin/login";
          },
        });

        try {
          await axiosInstance.post("/admin/logout");
        } catch (logoutErr) {
          console.error("Logout failed:", logoutErr);
        }

        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 403) {
      clearAdminEmail();

      try {
        await axiosInstance.post("/admin/logout");
      } catch (logoutErr) {
        console.error("Logout failed:", logoutErr);
      }

      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You don't have admin privileges.",
        timer: 6000,
        timerProgressBar: true,
        willClose: () => {
          window.location.href = "/admin/login";
        },
      });

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
