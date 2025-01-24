import axiosInstance from '../axios/axios';
const BASEURL = 'http://localhost:3000/user';


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


export const getExpenses = async (userId:string) => {
  try {
    console.log("userid : ",userId)
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

