import { AxiosError } from "axios";
import axiosInstance from "../axios/axios";
const BASEURL = "http://localhost:3000/api/auth"

interface IcreateUser {
  username: string
  email: string
  password: string
}

interface ErrorResponse {
  error: string
}

export const createUser = async (userData: IcreateUser) => {
  console.log(userData);

  try {
    const response = await axiosInstance.post(`${BASEURL}/register`, userData);
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
    const response = await axiosInstance.post(`${BASEURL}/verifyOtp`, {
      email,
      otp,
    });
    console.log("In Authservices-verifyOtp fn :",response.data)
    return response.data;
  } catch (err) {
    return err;
  }
};

// export const resendOtp = async (email: string) => {
//   try {
//     console.log(email);

//     const response = await axiosInstance.post(`${BASEURL}/resendOtp`, {
//       email,
//     });
//     return response.data;
//   } catch (err) {
//     return err;
//   }
// };

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
    const response = await axiosInstance.post(`${BASEURL}/forgotPassword`, {
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

// export const handleforgetpasswordOtp = async (email: string, otp: string) => {
//   try {
//     const response = await axiosInstance.post(
//       "/user/auth/verifyforgetpassword",
//       { email, otp }
//     );
//     return response.data;
//   } catch (err) {
//     const axiosError = err as AxiosError;
//     if (axiosError.response) {
//       const errorData = axiosError.response.data as ErrorResponse;
//       return errorData.error;
//     }
//   }
// };

// export const changePassword = async (email: string, password: string) => {
//   try {
//     const response = await axiosInstance.post(`${BASEURL}/user/auth/changePassword`, {
//       email,
//       password,
//     });
//     return response.data.message;
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const googleAuth = async (userCredential:string) => {
//   try {
//     const response = await axiosInstance.post(`/user/auth/googleauth/${userCredential}`);
//     return response.data
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const logout = () => {
//   localStorage.removeItem("userAccessToken");
//   localStorage.removeItem("userRefreshToken");
// };
