import axiosInstance from '../axios/axios'
const BASEURL = 'http://localhost:3000/user'

export interface Goal {
    _id?: string;
    userId?: string;
    title: string;
    description?: string;
    target: number;
    current: number;
    deadline: Date | string;
    category?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}


export const getGoals = async(userId:string)=>{
    const response = await axiosInstance.get(`${BASEURL}/getGoals/${userId}`)
    console.log("response : ",response)
    return response.data
}
export const createGoal = async(userId:string,goalData:Goal)=>{
    const response = await axiosInstance.post(`${BASEURL}/createGoals/${userId}`,goalData)
    console.log("response : ",response)
    return response.data
}
export const updateGoal = async()=>{
    const response = await axiosInstance.patch(`${BASEURL}/updateGoals`)
    console.log("response : ",response)
    return response.data
}
export const deleteGoal = async()=>{
    const response = await axiosInstance.delete(`${BASEURL}/deleteGoals`)
    console.log("response : ",response)
    return response.data
}
export const updateGoalProgress = async()=>{
    const response = await axiosInstance.patch(`${BASEURL}/updateGoalProgress`)
    console.log("response : ",response)
    return response.data
}
