import axiosInstance from '../axios/axios';
const BASEURL = 'http://localhost:3000/user';



export const uploadImageToS3 = async(formData:FormData)=>{
  try{
    const response = await axiosInstance.post(`${BASEURL}/upload`,formData,{
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }catch(error){
    console.error("error uploading image : ",error)
  }
}

export const updateUser = async (formData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string; }) => {
  try {
    const response = await axiosInstance.patch(`${BASEURL}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
    return response.data
  } catch (error) {
    console.error("Error updating user :", error)
    throw error;
  }
};


