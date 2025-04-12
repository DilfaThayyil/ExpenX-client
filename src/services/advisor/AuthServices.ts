import { AxiosError } from "axios";
import axiosInstance from "../axios/axios";
import { JwtPayload } from "jwt-decode";
const BASEURL = 'http://localhost:3000/advisor/auth'
import {IAdvisorData,ErrorResponse} from './types'


export const createUser = async (advisorData: IAdvisorData) => {

  try {
    const response = await axiosInstance.post(`${BASEURL}/register`, advisorData);
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;

    if (axiosError.response) {
      const errorData = axiosError.response.data as ErrorResponse;

      if (errorData.error === "Email is already in use") {
        return errorData.error;
      } else {
        console.error("An unexpected error occurred:", errorData);
      }
    } else {
      console.error("An unexpected error occurred:", axiosError);
    }
  }
};

export const otpGenerate = async (email: string) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/generateOtp`, {
      email,
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/verifyOtp`, {
      email,
      otp,
    });
    return { success: true, message: response.data.message }
  } catch (err: any) {
    throw err
  }
};

export const resendOtp = async (email: string) => {
  try {

    const response = await axiosInstance.post(`${BASEURL}/resendOtp`, {
      email,
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

export const userLogin = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/userLogin`, {
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export const handleforgetpassword = async (email: string) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/forgetPassword`, {
      email,
    });
    if (response) {
      return response.data;
    }
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
};

export const handleforgetpasswordOtp = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post(
      `${BASEURL}/forgetPassOtp`,
      { email, otp }
    );
    return { success: true, message: response.data.message }
  } catch (err: any) {
    throw err
  }
};

export const resetPasswordAdv = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/resetPassword`, {
      email,
      password,
    });
    return { success: true, message: response.data.message }
  } catch (err) {
    console.log(err);
  }
};

export const advisorGoogleAuth = async (userCredential: JwtPayload) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/googleAuth`, {
      userCredential: userCredential
    }, {
      withCredentials: true
    });
    return response.data
  } catch (err) {
    console.log(err);
  }
}

export const advisorLogout = async () => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/logout`)
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

