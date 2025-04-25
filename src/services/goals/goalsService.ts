import axiosInstance from '../axios/axios'
import {BACKENDENDPOINT} from '@/utility/env'
const BASEURL = `${BACKENDENDPOINT}/user`
import {Goal} from './types'


export const getGoals = async (userId: string) => {
    const response = await axiosInstance.get(`${BASEURL}/getGoals/${userId}`)
    return response.data
}

export const createGoal = async (userId: string, goalData: Goal) => {
    const response = await axiosInstance.post(`${BASEURL}/createGoals/${userId}`, goalData)
    return response.data
}

export const updateGoal = async (id: string, goalData: Partial<Goal>) => {
    const response = await axiosInstance.patch(`${BASEURL}/updateGoal/${id}`, goalData)
    return response.data
}

export const deleteGoal = async (id: string) => {
    const response = await axiosInstance.delete(`${BASEURL}/deleteGoal/${id}`)
    return response.data
}

export const updateGoalProgress = async (id: string, amount: number) => {
    const response = await axiosInstance.patch(`${BASEURL}/updateGoalProgress/${id}`, { amount })
    return response.data
}
