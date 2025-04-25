import axiosInstance from '../axios/axios'
import {BACKENDENDPOINT} from '@/utility/env'
const BASEURL = `${BACKENDENDPOINT}/user`
import {Message} from './types'



export const sendMessage = async(message:Message)=>{
  try{
    const response = await axiosInstance.post(`${BASEURL}/sendMessage`,message)
    return response.data
  }catch(err){
    console.error(err)
    throw err 
  }
}

export const fetchMessage = async (senderId: string, receiverId: string) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/fetchMessages/${senderId}/${receiverId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching messages:", error.response?.data || error.message);
    throw error;
  }
};


export const fetchUser = async(id:string)=>{
  try{
    const response = await axiosInstance.get(`${BASEURL}/fetchUser/${id}`)
    return response.data
  }catch(err){
    console.error(err)
  }
}

export const fetchAdvisor = async(id:string)=>{
  try{
    const response = await axiosInstance.get(`${BASEURL}/fetchAdvisor/${id}`)
    return response.data
  }catch(err){
    console.error(err)
  }
}


export const fetchChats = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/fetchChats/${userId}`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
};

export const fetchAllChats = async () => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/fetchAllChats`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching all chats:", error);
    return [];
  }
};

export const createChat = async (chatData: { user1: string; user2: string }) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/createChat`, chatData);
    return response.data;
  } catch (error) {
    console.error("Error creating chat:", error);
    return null;
  }
};

export const uploadChatFile =  async (formData:FormData)=>{
  try{
    const response = await axiosInstance.post(`${BASEURL}/uploadChatFile`,formData,{
      headers: {'Content-type': 'multipart/form-data'}
    })
    return response.data 
  }catch(err){
    console.error('Error uploading file : ',err)
    throw err
  }
}



export const getNotification = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/getNotification/${userId}`)
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId:string): Promise<boolean> => {
  try {
    const response = await axiosInstance.patch(`${BASEURL}/markAllRead/${userId}`)
    return response.data.success;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const deleteNotification = async (notificationId: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete(`${BASEURL}/deleteNotification/${notificationId}`)
    return response.data.success;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};
