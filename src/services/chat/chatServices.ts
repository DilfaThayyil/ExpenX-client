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
  timestamp?:string
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
    console.log("res-data-fetchMessages :",response.data)
    return response.data;
  } catch (error: any) {
    console.error("Error fetching messages:", error.response?.data || error.message);
    throw error;
  }
};


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