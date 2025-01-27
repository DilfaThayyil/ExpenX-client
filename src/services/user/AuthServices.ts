import { AxiosError } from "axios";
import axiosInstance from "../axios/axios";
import { JwtPayload } from "jwt-decode";
const BASEURL = 'http://localhost:3000/user/auth'


interface IcreateUser {
  username: string
  email: string
  password: string
}

interface ErrorResponse {
  error: string
}

export const createUser = async (userData: IcreateUser) => {
  console.log("userData in AuthService : ",userData);

  try {
    const response = await axiosInstance.post(`${BASEURL}/register`, userData)
    console.log("response in createUser: ",response.data)
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
    console.log("otpGenerate response :",response.data.message)
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const verifyOtp = async (email: string, otp: string) => {
    console.log("email $ otp : ",email,otp)
    const response = await axiosInstance.post(`${BASEURL}/verifyOtp`,
      { email, otp }
    )
    return { success: true, message: response.data.message }
};

////////some updation should be here in verifyOtp///////////////

export const resendOtp = async (email: string) => {
  try {
    console.log("email for resendOtp : ",email);
    const response = await axiosInstance.post(`${BASEURL}/resendOtp`, {
      email,
    });
    console.log("resendotp response : ",response.data.message)
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
    console.log(response.data)
    console.log(response.data.message)
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
      const errorData = axiosError.response.data as { message: string };
      throw new Error(errorData.message);
    }
    throw new Error('An unexpected error occurred');
  }
};

export const handleforgetpasswordOtp = async (email: string, otp: string) => {
    console.log("email $ otp : ",email,otp)
    const response = await axiosInstance.post(`${BASEURL}/forgetPassOtp`,
      { email, otp }
    )
    return { success: true, message: response.data.message }
};

/////////////some updation need here in handleForgetPasswordOtp////////////

export const resetPassword = async (email: string, password: string) => {
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

export const userGoogleAuth = async (userCredential:JwtPayload) => {
  try {
    console.log(userCredential,"123456")    
    const response = await axiosInstance.post(`${BASEURL}/googleAuth`,{
      userCredential:userCredential
    },{
      withCredentials:true
    })
    return response.data
  } catch (err) {
    console.log(err);
  }
};

// export const logout = () => {
//   localStorage.removeItem("userAccessToken");
//   localStorage.removeItem("userRefreshToken");
// };
