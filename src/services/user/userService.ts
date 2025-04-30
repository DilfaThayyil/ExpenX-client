import axiosInstance from '../axios/axios';
import { IReportData } from '@/components/modals/types'
import { BACKENDENDPOINT } from '@/utility/env'
const BASEURL = `${BACKENDENDPOINT}/user`
import { Expense } from '@/pages/user/types'


export const uploadImageToCloudinary = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
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
    throw error;
  }
}


export const createExpense = async (formData: Expense, userId: string) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/createExpense/${userId}`, formData);
    return response;
  } catch (error) {
    throw error;
  }
};


export const getExpenses = async (userId: string, currentPage: number, limit: number, search: string) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/getExpenses/${userId}`, {
      params: { currentPage, limit, search }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/getCategories`)
    return response.data
  } catch (err) {
    throw err
  }
}



export const bookSlot = async (slotId: string, userId: string) => {
  try {
    const response = await axiosInstance.patch(`${BASEURL}/bookslot`, { slotId, userId })
    return response.data
  } catch (err) {
    throw err
  }
}

export const paymentInitiate = async (slotId: string, userId: string, advisorId: string, amount: number) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/paymentInitiate`, {
      slotId, userId, advisorId, amount
    })
    return response.data
  } catch (err) {
    throw err
  }
}

export const fetchSlotsByUser = async (userId: string, page: number, limit: number) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/fetchSlotsByUser/${userId}?page=${page}&limit=${limit}`)
    return response.data
  } catch (err) {
    throw err
  }
}

export const reportAdvisor = async (slotId: string, reportData: IReportData) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/reportAdvisor/${slotId}`, reportData);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export const getDashboardData = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/getDashboardData/${userId}`)
    return response.data
  } catch (err) {
    throw err
  }
}

export const exportExpense = async (userId: string, format: string, startDate?: Date | null, endDate?: Date | null) => {
  try {
    const params: any = { format, userId };
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    const response = axiosInstance.get(`${BASEURL}/exportExpense`, {
      params,
      responseType: 'blob',
    });
    return response
  } catch (err) {
    throw err
  }
};

export const deleteExpense = async (id: number | undefined) => {
  try {
    const response = await axiosInstance.delete(`${BASEURL}/deleteExpense/${id}`)
    return response
  } catch (err) {
    throw err
  }
}

