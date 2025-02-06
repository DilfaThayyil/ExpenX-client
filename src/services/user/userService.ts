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


export const createGroup = async (formData: { name: string; members: string[]; splitMethod: string }) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/createGroup`, formData);
    console.log('Response in service:', response);
    return response.data;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};


export const getUserGroups = async (email: string) => {
  try {
    console.log("email --- ", email)
    const response = await axiosInstance.get(`${BASEURL}/getUserGroups/${email}`);

    const transformedGroups = response.data.groups.map((group: any) => ({
      id: group._id || group.id,
      name: group.name,
      totalExpenses: 0,
      memberCount: group.members ? group.members.length : 0,
      balance: 0,
      lastActivity: group.expenses && group.expenses.length > 0
        ? group.expenses[group.expenses.length - 1].description
        : 'No recent activity',
      members: group.members
        ? group.members.map((memberEmail: string) => ({
          id: memberEmail.replace('@', '_'),
          name: memberEmail.split('@')[0],
          avatar: `https://ui-avatars.com/api/?name=${memberEmail.split('@')[0]}`,
          paid: 0,
          owed: 0
        }))
        : [],
      expenses: group.expenses || [],
      splitMethod: group.splitMethod || 'equal'
    }));

    return transformedGroups;

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
    console.log("response in frontService : ", response.data)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}


export const addExpenseInGroup = async (groupId: string,
  expenseData: { description: string; amount: number; paidBy: string; date: string; splitMethod: string }
) => {
  try {
    console.log("groupId : ",groupId)
    console.log("expenseData: ",expenseData)
    const response = await axiosInstance.post(`${BASEURL}/addExpenseInGroup/${groupId}`, expenseData)
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const bookSlot = async(slotId:string, userId:string)=>{
  try{
    const response = await axiosInstance.patch(`${BASEURL}/bookslot`,{slotId,userId})
    console.log("response-data :",response.data)
    return response.data
  }catch(err){
    console.error(err)
    throw err
  }
}

