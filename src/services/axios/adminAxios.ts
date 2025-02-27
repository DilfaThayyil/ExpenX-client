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

    if (error.response) {
      const { status, data } = error.response;
      console.warn("🔴 Axios Error:", status, data);

      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Session expired.Please login again.",
          timer: 6000,
          timerProgressBar: true,
          willClose: () => {
            window.location.href = "/admin/login";
          },
        });
        await axiosInstance.post("/admin/logout")
        clearAdminEmail();
        return Promise.reject(error);
      }

      if (status === 403) {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "You dont have admin Privilages..",
          timer: 6000,
          timerProgressBar: true,
          willClose: () => {
            window.location.href = "/admin/login";
          },
        });
        await axiosInstance.post("/admin/logout")
        clearAdminEmail();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
