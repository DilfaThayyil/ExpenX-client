import axiosInstance from '../axios/axios'
const BASEURL = 'http://localhost:3000/user'


// interface PostImageResponse{
//     url:string
// }

export interface Message{
  id:string
  sender:string
  receiver:string
  text:string
  // timestamp?:string
}


export const sendMessage = async(message:Message)=>{
  try{
    console.log("message : ",message)
    const response = await axiosInstance.post(`${BASEURL}/sendMessage`,message)
    console.log("response-sendMessage :",response.data)
    return response.data
  }catch(err){
    console.error(err)
    throw err
  }
}

export const fetchMessage = async (senderId: string, receiverId: string) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/fetchMessages/${senderId}/${receiverId}`);
    console.log("fetchMessages :",response.data)
    return response.data;
  } catch (error: any) {
    console.error("Error fetching messages:", error.response?.data || error.message);
    throw error;
  }
};


export const fetchUser = async(id:string)=>{
  try{
    const response = await axiosInstance.get(`${BASEURL}/fetchUser/${id}`)
    console.log("response-fetchUser :",response.data)
    return response.data
  }catch(err){
    console.error(err)
  }
}

export const fetchAdvisor = async(id:string)=>{
  try{
    const response = await axiosInstance.get(`${BASEURL}/fetchAdvisor/${id}`)
    console.log("response-fetchAdvisor :",response.data)
    return response.data
  }catch(err){
    console.error(err)
  }
}


export const fetchChats = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/fetchChats/${userId}`);
    console.log("response : ",response)
    return response.data.result;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
};

export const fetchAllChats = async () => {
  try {
    const response = await axiosInstance.get(`${BASEURL}/fetchAllChats`);
    console.log("response : ",response)
    return response.data.result;
  } catch (error) {
    console.error("Error fetching all chats:", error);
    return [];
  }
};

export const createChat = async (chatData: { user1: string; user2: string }) => {
  try {
    const response = await axiosInstance.post(`${BASEURL}/createChat`, chatData);
    console.log("response : ",response)
    return response.data;
  } catch (error) {
    console.error("Error creating chat:", error);
    return null;
  }
};

export const uploadChatFile =  async (formData:FormData)=>{
  try{
    console.log("formData-serv : ",formData)
    const response = await axiosInstance.post(`${BASEURL}/uploadChatFile`,formData,{
      headers: {'Content-type': 'multipart/form-data'}
    })
    console.log("response : ",response)
    return response.data 
  }catch(err){
    console.error('Error uploading file : ',err)
    throw err
  }
}



// export const findMyFriends= async(id:string)=>{
//     try{
//         const response = await axiosInstance.get(`${BASEURL}/findMyFriends/${id}`)
//         console.log("response :",response.data)
//         return response.data
//     }catch(err){
//         console.error(err)
//         throw err
//     }
// }

// export const getMessage = async(conversationId:string)=>{
//     try{
//         const response = await axiosInstance.get(`${BASEURL}/getMessage/${conversationId}`)
//         console.log(response.data)
//         return response.data
//     }catch(err){
//         console.log(err)
//         throw err
//     }
// }

// export const postImage = async (data: object): Promise<PostImageResponse> => {
//     try {
//         const response = await axiosInstance.post(`${BASEURL}/postImage`, data, {
//             headers: { 'Content-Type': 'multipart/form-data' },
//           });
//       return response.data;
//     } catch (err) {
//       const axiosError = err as AxiosError;
//       if (axiosError.response && axiosError.response.data) {
//         return axiosError.response.data as PostImageResponse;
//       } else {
//         throw new Error("An unexpected error occurred.");
//       }
//     }
//   };