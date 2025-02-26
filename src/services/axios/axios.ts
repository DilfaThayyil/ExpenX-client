import axios from "axios";
import Swal from "sweetalert2";
import { BACKENDENDPOINT } from "../../utility/env";
import Store from "@/store/store";

const clearCookie = (cookieName: string) => {
  document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
}

const axiosInstance = axios.create({
  baseURL: BACKENDENDPOINT,
  withCredentials: true,
});

console.log("axiosInstance.......29837549832")
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      console.log(" ### ........if error in axiosInstance.....#####")
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // ❗ Check if refresh token exists in cookies before trying to refresh
        const refreshToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("refreshToken="));

        if (!refreshToken) {
          console.log("❌ No refresh token found! Logging out...");
          await axiosInstance.post("/user/auth/logout");
          Store.getState().clearUser();
          clearCookie("accessToken");
          clearCookie("refreshToken");
          window.location.href = "/";
          return Promise.reject(error);
        }

        try {
          console.log("🔄 Refreshing access token...");
          const { data } = await axiosInstance.post("/user/auth/refresh-token");

          // ✅ Store new access token in cookies
          document.cookie = `accessToken=${data.accessToken}; path=/;`;

          console.log("✅ Token refreshed successfully.");
          return axiosInstance(originalRequest);
        } catch (err) {
          console.log("❌ Token refresh failed. Logging out...");

          await axiosInstance.post("/user/auth/logout");
          Store.getState().clearUser();
          clearCookie("accessToken");
          clearCookie("refreshToken");
          window.location.href = "/";
          return Promise.reject(err);
        }
      }

      if (error.response.status === 403) {
        console.log("❌ User is blocked by admin!");
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
