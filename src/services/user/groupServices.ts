import axiosInstance from '../axios/axios';
import { BACKENDENDPOINT } from '@/utility/env'
import { Settlement } from './types'
const BASEURL = `${BACKENDENDPOINT}/user/group`


export const createGroup = async (userId: string, name: string, members: string[], email: string) => {
    try {
        const response = await axiosInstance.post(`${BASEURL}/createGroup`, { userId, name, members, email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserGroups = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`${BASEURL}/getUserGroups/${userId}`);
        return response.data.groups
    } catch (error) {
        throw error;
    }
};

export const addMember = async (groupId: string, memberEmail: string) => {
    try {
        const response = await axiosInstance.post(`${BASEURL}/addMember/${groupId}`, {
            memberEmail
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const addExpenseInGroup = async (groupId: string,
    expenseData: { title: string; totalAmount: number; paidBy: string; date: string; splitMethod: string }
) => {
    try {
        const response = await axiosInstance.post(`${BASEURL}/addExpenseInGroup/${groupId}`, expenseData)
        return response.data
    } catch (error) {
        throw error;
    }
};

export const removeMember = async (groupId: string, memberEmail: string) => {
    try {
        const response = await axiosInstance.post(`${BASEURL}/removeMember/${groupId}`, { memberEmail });
        return response.data;
    } catch (err) {
        throw err;
    }
};

export const leaveGroup = async (groupId: string, userEmail: string) => {
    try {
        const response = await axiosInstance.post(`${BASEURL}/leaveGroup/${groupId}`, { userEmail });
        return response.data;
    } catch (err) {
        throw err;
    }
};

export const settleDebt = async (groupId: string, settlementData: Settlement) => {
    try {
        const response = await axiosInstance.post(`${BASEURL}/settleDebt/${groupId}`, { settlementData });
        return response.data;
    } catch (err) {
        throw err;
    }
};

export const acceptGroupInvite = async (groupId:string,email:string)=>{
    try{
        const response = await axiosInstance.get(`${BASEURL}/acceptInvite/${groupId}?email=${email}`);
        return response
    }catch(err){
        throw err
    }
}