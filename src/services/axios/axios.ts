import axios from "axios";
import Swal from "sweetalert2";
import { BACKENDENDPOINT } from "../../utility/env";


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
          await axiosInstance.post("/user/auth/refresh-token");
          return axiosInstance(originalRequest);
        } catch (err) {
          window.location.href = "/login";
          clearCookie('accessToken')
          clearCookie('refreshToken')
          return Promise.reject(err);
        }
      } else if (error.response.status === 403) {
        localStorage.clear();
        console.log('you have been blocked!')
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "You have been blocked. Please contact support.",
          timer: 6000,
          timerProgressBar: true,
          willClose: () => {
            window.location.href = "/login";
          },
        });
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
