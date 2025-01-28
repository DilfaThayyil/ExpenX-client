import { AxiosError } from "axios";
import axios from 'axios'
const BASEURL = "http://localhost:3000/admin";



export const adminLogin = async (username:string, email: string, password: string) => {
  try {
    const response = await axios.post(`${BASEURL}/login`, {
       username,
       email,
       password 
      })
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

export const fetchUsers = async (page: number, limit: number) => {
  const response = await axios.get(`${BASEURL}/users`, {
    params: { page, limit },
  });
  return response.data;
}

export const fetchAdvisors = async (page: number, limit: number) => {
  const response = await axios.get(`${BASEURL}/advisors`, {
    params: { page, limit },
  });
  return response.data;
}

export const updateAdmin = async (name:string,email:string,password:string)=>{
  try{
    console.log("name : ",name)
    console.log("email : ",email)
    console.log("password : ",password)
    const response = await axios.post(`${BASEURL}/updateAdmin`,{
      name,
      email,
      password
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}


// export const manageUser = async (action: string, email: string) => {
//   try {
//     const response = await axiosInstance.put(`${BASEURL}/updateUserBlockStatus/`, {
//       action,
//       email,
//     });
//     return response.data;
//   } catch (err) {
//     console.log(err);
//   }
// }