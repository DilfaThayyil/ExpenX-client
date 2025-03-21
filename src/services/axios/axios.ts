import axios from "axios";
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

    if (error.response) {
      if (error.response.status === 401 &&  !originalRequest._retry) {
          originalRequest._retry = true;
        try {
          console.log("🔄 Refreshing access token...");
          const { data } = await axiosInstance.post(`/user/auth/refresh-token`);
          console.log("data : ", data)
          console.log("✅ Token refreshed successfully.");
          return axiosInstance(originalRequest)
        } catch (err) { 
          console.log("❌ refresh token failed. Logging out...");
          Store.getState().clearUser()
          console.log("store cleared due to 401 . logging out...")
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "You have been logged out. Please contact support.",
            timer: 6000,
            timerProgressBar: true,
            willClose: () => {
              window.location.href = "/";
            },
          });
          await axiosInstance.post(`/user/auth/logout`);
          return Promise.reject(err);
        }

      } else if (error.response.status === 403) {
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
