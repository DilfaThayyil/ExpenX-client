import { AxiosError } from "axios";
import axiosInstance from '../axios/adminAxios'
import {BACKENDENDPOINT} from '@/utility/env'
const BASEURL = `${BACKENDENDPOINT}/admin`


export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/login`, {
       email,
       password 
      })
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response) {
      return { error: error.response.data };
    }
    return { error: "An unexpected error occurred" };
  }
};

export const fetchUsers = async (page: number, limit: number,search:string) => {
  const response = await axiosInstance.get(`${BASEURL}/users`, {
    params: { page, limit, search},
  });
  return response.data;
}

export const fetchAdvisors = async (page: number, limit: number, search:string) => {
  const response = await axiosInstance.get(`${BASEURL}/advisors`, {
    params: { page, limit, search},
  });
  return response.data;
}

export const updateAdmin = async (name:string,email:string,password:string)=>{
  try{

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
    throw err
  }
}

export const fetchCategories = async(page:number,limit:number,search:string)=>{
  try{
    const response = await axiosInstance.get(`${BASEURL}/categories`,{
      params:{page,limit,search}
    })
    return response.data
  }catch(err){
    throw err
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



export const fetchReports = async(page:number,limit:number)=>{
  const reponse = await axiosInstance.get(`${BASEURL}/reports`,{
    params:{page,limit}
  })
  return reponse.data
}

export const adminLogout = async()=>{
  const response = await axiosInstance.post(`${BASEURL}/logout`)
  return response.data
}

export const fetchMonthlyTrends = async()=>{
  const response = await axiosInstance.get(`${BASEURL}/getMonthlyTrends`)
  return response.data
}

export const fetchExpenseCategories = async()=>{
  const response = await axiosInstance.get(`${BASEURL}/getExpenseCategories`)
  return response.data
}

export const fetchDashboardStats = async()=>{
  const response = await axiosInstance.get(`${BASEURL}/getDashboardStats`)
  return response.data
}

export const fetchUserGrowth = async()=>{
  const response = await axiosInstance.get(`${BASEURL}/getUserGrowth`)
  return response.data
}