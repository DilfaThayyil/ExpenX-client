import axiosInstance from "../axios/axios";
import { AxiosError } from "axios";

const BASEURL = "http://localhost:3000/admin";

export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/login`, { email, password });
    const { accessToken, refreshToken } = response.data;

    if (accessToken && refreshToken) {
      localStorage.setItem("AdminAccessToken", accessToken);
      localStorage.setItem("AdminRefreshToken", refreshToken);
    }
    console.log("response in service : ",response.data)
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response) {
      return { error: error.response.data };
    }
    return { error: "An unexpected error occurred" };
  }
};
