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

export const fetchSlots = async()=>{  
  try{
    const response = await axiosInstance.get(`${BASEURL}/fetchSlots`)
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


export const getBookedSlotsForAdvisor = async(advisorId:string)=>{
  try{
    console.log("advisorId-service :",advisorId)
    const response = await axiosInstance.get(`${BASEURL}/fetchSlots/${advisorId}`)
    console.log("response-data :",response.data)
    return response.data
  }catch(err){
    console.error(err)
    throw err
  }
}