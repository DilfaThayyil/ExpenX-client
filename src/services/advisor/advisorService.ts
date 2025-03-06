import axiosInstance from '../axios/axios';
const BASEURL = 'http://localhost:3000/advisor';


interface Slot {
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxBookings: number;
  status: 'Available' | 'Booked' | 'Cancelled';
  location: "Virtual" | "Physical";
  locationDetails?: string;
  description?: string;
}


export const uploadImageToCloudinary = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const updateUser = async (formData: { profilePic: string; username: string; email:string; phone: string; country: string; language: string }) => {
  try {
    const response = await axiosInstance.patch(`${BASEURL}/editProfile`, formData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export const createSlot = async (id:string,slotData:Slot) => {
  try {
    console.log("advissor Id : ",id)
    const response = await axiosInstance.post(`${BASEURL}/createSlot`, {id,slotData});
    console.log("response-data : ",response.data)
    return response.data;
  } catch (error) {
    console.error(error)
    throw error || "Failed to create slot";
  }
}

export const fetchSlots = async(advisorId:string,page:number,limit:number)=>{  
  try{
    console.log("page,limit: ",page," ",limit)
    const response = await axiosInstance.get(`${BASEURL}/fetchSlots/${advisorId}`,{
      params:{page,limit}
    })
    console.log("response-data : ",response.data)
    return response.data
  }catch(err){
    console.error(err)
    throw err
  }
}

export const updateSlot = async(updatedSlot:Slot,slotId:string)=>{
  try{
    const response = await axiosInstance.patch(`${BASEURL}/updateSlot/${slotId}`,updatedSlot)
    console.log("response-data : ",response.data)
    return response.data
  }catch(err){
    console.error(err)
    throw err
  }
}

export const deleteSlot = async(slotId:string)=>{
  try{
    const response = await axiosInstance.delete(`${BASEURL}/deleteSlot/${slotId}`)
    console.log("response-data : ",response.data)
    return response.data
  }catch(err){
    console.error(err)
    throw err
  }
}


export const getBookedSlotsForAdvisor = async(advisorId:string,page:number,limit:number)=>{
  try{
    console.log("advisorId-service :",advisorId)
    const response = await axiosInstance.get(`${BASEURL}/fetchSlotsAdvisor/${advisorId}`,{
      params:{page,limit}
    })
    console.log("response-data :",response.data)
    return response.data
  }catch(err){
    console.error(err)
    throw err
  }
}

export const fetchDashboard = async(advisorId:string)=>{
  try{
    const response = await axiosInstance.get(`${BASEURL}/fetchDashboard/${advisorId}`)
    console.log("response : ",response.data)
    return response.data
  }catch(err){
    console.error(err)
    throw err
  }
}

export const fetchRevenue = async(advisorId:string,timeFrame:'monthly' | 'quarterly' | 'yearly')=>{
  try{
    const response = await axiosInstance.get(`${BASEURL}/fetchRevenue/${advisorId}?timeFrame=${timeFrame}`,)
    console.log("response : ",response.data)
    return response.data
  }catch(err){
    console.error(err)
    throw err
  }
}

export const fetchClientGoals = async(advisorId:string)=>{
  try{
    const response = await axiosInstance.get(`${BASEURL}/fetchClientGoals/${advisorId}`)
    console.log("response : ",response)
    return response.data
  }catch(err){
    console.error(err)
    throw err
  }
}

export const comingAppointments = async(advisorId:string)=>{
  try{
    const response = await axiosInstance.get(`${BASEURL}/getUpcomingAppointments/${advisorId}`)
    console.log("response-serv : ",response.data)
    return response.data
  }catch(err){
    console.error(err)
    throw err
  }
}

export const fetchRecentClients = async(advisorId:string)=>{
  try{
    const response = await axiosInstance.get(`${BASEURL}/getRecentClients/${advisorId}`)
    console.log("resposne-serv-recentCliets : ",response.data)
    return response.data
  }catch(err){
    console.error(err)
    throw err
  }
}