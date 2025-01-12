import { AxiosError } from "axios";
import axiosInstance from "../axios/axios";
import { JwtPayload } from "jwt-decode";
const BASEURL = 'http://localhost:3000/advisor/auth'


interface IAdvisorData {
  username: string
  email: string
  password: string
}

interface ErrorResponse {
  error: string
}

export const createUser = async (advisorData: IAdvisorData) => {
  console.log(advisorData);

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
    console.log("In Authservices :",response.data.message)
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    console.log('email & otp in verifyOtp authService...',email,otp)
    const response = await axiosInstance.post(`${BASEURL}/verifyOtp`, {
      email,
      otp,
    });
    console.log("In advisorAuthservices-verifyOtp fn :", response.data)
    return {success:true, message:response.data.message}
  } catch (err:any) {
    throw err
  }
};

export const resendOtp = async (email: string) => {
  try {
    console.log(email);

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
    const { accessToken, refreshToken } = response.data;
    if (accessToken && refreshToken) {
      localStorage.setItem("userAccessToken", accessToken);
      localStorage.setItem("userRefreshToken", refreshToken);
    }
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
    console.log("response in forgtPassOtp : ",response)
    return { success: true, message: response.data.message }
  } catch (err:any) {
    throw err
  }
};

export const resetPasswordAdv = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/resetPassword`, {
      email,
      password,
    });
    return {success:true,message : response.data.message}
  } catch (err) {
    console.log(err);
  }
};

export const advisorGoogleAuth = async (userCredential:JwtPayload) => {
  try {
    console.log(userCredential,"123456")    
    const response = await axiosInstance.post(`${BASEURL}/googleAuth`,{
      userCredential:userCredential
    },{
      withCredentials:true
    });
    return response.data
  } catch (err) {
    console.log(err);
  }
};

// export const logout = () => {
//   localStorage.removeItem("userAccessToken");
//   localStorage.removeItem("userRefreshToken");
// };
