import axiosInstance from '../axios/axios';
const BASEURL = 'http://localhost:3000/advisor';
import {Slot} from './types'


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

export const updateUser = async (formData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }) => {
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

export const createSlot = async (id: string, slotData: Slot) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/createSlot`, { id, slotData });
    return response.data;
  } catch (error) {
    console.error(error)
    throw error || "Failed to create slot";
  }
}

export const fetchSlots = async (advisorId: string, page: number, limit: number) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/fetchSlots/${advisorId}`, {
      params: { page, limit }
    })
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const updateSlot = async (updatedSlot: Slot, slotId: string) => {
  try {
    const response = await axiosInstance.patch(`${BASEURL}/updateSlot/${slotId}`, updatedSlot)
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const deleteSlot = async (slotId: string) => {
  try {
    const response = await axiosInstance.delete(`${BASEURL}/deleteSlot/${slotId}`)
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}


export const getBookedSlotsForAdvisor = async (advisorId: string, page: number, limit: number) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/fetchSlotsAdvisor/${advisorId}`, {
      params: { page, limit }
    })
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const fetchDashboard = async (advisorId: string) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/fetchDashboard/${advisorId}`)
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const fetchRevenue = async (advisorId: string, timeFrame: 'monthly' | 'quarterly' | 'yearly') => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/fetchRevenue/${advisorId}?timeFrame=${timeFrame}`,)
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const fetchClientGoals = async (advisorId: string) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/fetchClientGoals/${advisorId}`)
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const comingAppointments = async (advisorId: string) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/getUpcomingAppointments/${advisorId}`)
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const fetchRecentClients = async (advisorId: string) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/getRecentClients/${advisorId}`)
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const getClientMeetings = async (clientId: string | undefined, advisorId: string) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/getClientMeetings`, {
      params: { clientId, advisorId }
    })
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const getClient = async (clientId: string | undefined) => {
  try {
    console.log("starting....service : ", clientId)
    const response = await axiosInstance.get(`${BASEURL}/getClient/${clientId}`)
    console.log("service-getClient : ", response.data)
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const getExpenseByCategory = async (clientId: string | undefined, expenseTimeframe: string, customStartDate: string, customEndDate: string) => {
  try {
    const params: any = { clientId, expenseTimeframe };

    if (expenseTimeframe === "custom" && customStartDate && customEndDate) {
      params.customStartDate = customStartDate;
      params.customEndDate = customEndDate;
    }
    const response = await axiosInstance.get(`${BASEURL}/getExpenseByCategory`, { params });
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const getDocuments = async (clientId: string, advisorId: string) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/getDocuments`, {
      params: { clientId, advisorId },
    })
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const uploadDocument = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/uploadDocument`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    console.log("response-servvvv : ", response.data)
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const getTransactions = async (userId: string | undefined) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/getTransactions/${userId}`)
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const cancelSlot = async (slotId: string,advisorId:string,userId:string|undefined) => {
  try {
    const response = await axiosInstance.patch(`${BASEURL}/cancelSlot/${slotId}`,{
      advisorId,userId
    })
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const getWallet = async (userId:string) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/getWallet/${userId}`)
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

