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

    // Check if 401 AND not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorMessage = error.response?.data?.message || "";

      // Check if it's a refresh token failure
      if (errorMessage === "Refresh token expired") {
        console.log("Refresh token expired. Logging out...");

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

      originalRequest._retry = true;
      try {
        console.log("Attempting to refresh token...");
        await axiosInstance.post(`/admin/refresh-token`);
        console.log("Token refreshed successfully.");
        return axiosInstance(originalRequest); // retry original request
      } catch (refreshError) {
        console.log("Refresh token request failed.");

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

        return Promise.reject(refreshError); // final reject
      }
    }
    else if (error.response.status === 403) {
      console.log("admin store cleard due to 403 . Logging out...")
      clearAdminEmail();
      await axiosInstance.post("/admin/logout")
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You don't have admin Privilages..",
        timer: 6000,
        timerProgressBar: true,
        willClose: () => {
          window.location.href = "/admin/login";
        },
      });
      return Promise.reject(error);
    }

    return Promise.reject(error); // any other error
  }
);


export default axiosInstance;
