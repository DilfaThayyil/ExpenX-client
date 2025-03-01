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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          console.log("🔄 Refreshing access token...");
          const { data } = await axiosInstance.post(`${BACKENDENDPOINT}/user/auth/refresh-token`);
          console.log("data : ",data)
          document.cookie = `accessToken=${data.accessToken}; path=/;`;

          console.log("✅ Token refreshed successfully.");
          return axiosInstance(originalRequest);
        } catch (err) {
          console.log("❌ Token refresh failed. Logging out...");

          await axiosInstance.post(`${BACKENDENDPOINT}/user/auth/logout`);
          Store.getState().clearUser()
        
          window.location.href = "/";
          clearCookie('accessToken');
          clearCookie('refreshToken');
          return Promise.reject(err);
        }
      } 
      
      if (error.response.status === 403) {
        console.log('❌ User is blocked by admin!');
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
