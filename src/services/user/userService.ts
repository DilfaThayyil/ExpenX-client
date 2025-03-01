import axiosInstance from '../axios/axios';
const BASEURL = 'http://localhost:3000/user';
import {IReportData} from '@/components/modals/reportModal'


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


export const createExpense = async (formData: FormData, userId: string) => {
  try {
    console.log("sdfksdjfk")
    const response = await axiosInstance.post(`${BASEURL}/createExpense/${userId}`, formData);
    return response;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};


export const getExpenses = async (userId: string) => {
  try {
    console.log("userid : ", userId)
    const response = await axiosInstance.get(`${BASEURL}/getExpenses/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};


// export const updateExpense = async (expenseId: number, expense: any) => {
//   try {
//     const response = await axiosInstance.patch(`${BASEURL}/updateExpense/${expenseId}`, expense);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating expense:', error);
//     throw error;
//   }
// };


// export const deleteExpense = async (expenseId: number) => {
//   try {
//     const response = await axiosInstance.delete(`${BASEURL}/deleteExpense/${expenseId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting expense:', error);
//     throw error;
//   }
// };


export const createGroup = async (userId:string,name:string,members:string[]) => {
  try {
    console.log(userId,name,members)
    const response = await axiosInstance.post(`${BASEURL}/createGroup`, {userId,name,members});
    console.log('Response in service:', response);
    return response.data;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};


export const getUserGroups = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/getUserGroups/${userId}`);
    console.log("response : ",response)
    return response.data.groups
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }
};


export const addMember = async (groupId: string, memberEmail: string) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/addMember/${groupId}`, {
      memberEmail
    })
    console.log("response : ",response)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}


export const addExpenseInGroup = async (groupId: string,
  expenseData: { title: string; totalAmount: number; paidBy: string; date: string; splitMethod: string }
) => {
  try {
    console.log("groupId : ", groupId)
    console.log("expenseData: ", expenseData)
    const response = await axiosInstance.post(`${BASEURL}/addExpenseInGroup/${groupId}`, expenseData)
    console.log("response- serv : ",response.data)
    return response.data
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const bookSlot = async (slotId: string, userId: string) => {
  try {
    const response = await axiosInstance.patch(`${BASEURL}/bookslot`, { slotId, userId })
    console.log("response-data :", response.data)
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const paymentInitiate = async (slotId: string, userId: string, advisorId: string, amount: number) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/paymentInitiate`, {
      slotId, userId, advisorId, amount
    })
    console.log("response : ", response.data)
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const reportAdvisor = async (reportData: IReportData) => {
  try {
    console.log("reportData : ",reportData)
      const response = await axiosInstance.post(`${BASEURL}/reportAdvisor`, reportData);
      console.log("response-data:", response.data);
      return response.data;
  } catch (err) {
      console.error(err);
      throw err;
  }
};
