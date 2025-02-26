import { AxiosError } from "axios";
import axiosInstance from '../axios/adminAxios'
const BASEURL = "http://localhost:3000/admin";



export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/login`, {
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
  const response = await axiosInstance.get(`${BASEURL}/users`, {
    params: { page, limit },
  });
  console.log("fetchUsers-response : ",response.data)
  return response.data;
}

export const fetchAdvisors = async (page: number, limit: number) => {
  const response = await axiosInstance.get(`${BASEURL}/advisors`, {
    params: { page, limit },
  });
  console.log("fetchAdvisors-reponse : ",response)
  return response.data;
}

export const updateAdmin = async (name:string,email:string,password:string)=>{
  try{
    console.log("name : ",name)
    console.log("email : ",email)
    console.log("password : ",password)
    const response = await axiosInstance.post(`${BASEURL}/updateAdmin`,{
      name,
      email,
      password
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}


export const manageUser = async (action: string,type:'user'|'advisor', email: string) => {
  try {
    const endPoint = type === 'user' ? `${BASEURL}/updateUserBlockStatus` : `${BASEURL}/updateAdvisorBlockStatus/`
    const response = await axiosInstance.patch(endPoint, {action,email})
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export const fetchCategories = async(page:number,limit:number)=>{
  try{
    const response = await axiosInstance.get(`${BASEURL}/categories`,{
      params:{page,limit}
    })
    console.log("response-data : ",response.data)
    return response.data
  }catch(err){
    console.log(err)
  }
}

export const manageCategory = async (action: string, id?: string, name?: string) => {
  try {
    if (action === "add") {
      const response = await axiosInstance.post(`${BASEURL}/addCategory`, { name });
      return response.data;
    } else if (action === "edit") {
      const response = await axiosInstance.patch(`${BASEURL}/updateCategory/${id}`, { name });
      return response.data;
    }else if(action === "delete"){
      const response = await axiosInstance.delete(`${BASEURL}/deleteCategory/${id}`)
      return response.data
    } else {
      throw new Error(`Invalid action: ${action}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const adminLogout = async()=>{
  const response = await axiosInstance.post(`${BASEURL}/logout`)
  return response.data
}