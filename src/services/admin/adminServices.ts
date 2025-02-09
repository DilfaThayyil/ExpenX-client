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
  console.log("fetchUsers-response : ",response.data)
  return response.data;
}

export const fetchAdvisors = async (page: number, limit: number) => {
  const response = await axios.get(`${BASEURL}/advisors`, {
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


export const manageUser = async (action: string,type:'user'|'advisor', email: string) => {
  try {
    const endPoint = type === 'user' ? `${BASEURL}/updateUserBlockStatus` : `${BASEURL}/updateAdvisorBlockStatus/`
    const response = await axios.patch(endPoint, {action,email})
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export const fetchCategories = async(page:number,limit:number)=>{
  try{
    const response = await axios.get(`${BASEURL}/categories`,{
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
      const response = await axios.post(`${BASEURL}/addCategory`, { name });
      return response.data;
    } else if (action === "edit") {
      const response = await axios.patch(`${BASEURL}/updateCategory/${id}`, { name });
      return response.data;
    }else if(action === "delete"){
      const response = await axios.delete(`${BASEURL}/deleteCategory/${id}`)
      return response.data
    } else {
      throw new Error(`Invalid action: ${action}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};