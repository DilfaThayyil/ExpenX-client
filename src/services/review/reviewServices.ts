import axiosInstance from '../axios/axios'
const BASEURL = 'http://localhost:3000/user'
const advBASEURL = 'http://localhost:3000/advisor'

export const getAdvisors = async()=>{
  const response = await axiosInstance.get(`${BASEURL}/getAdvisors`)
  return response.data
}

export const createReview = async (advisorId: string,userId:string,rating: number, review: string) => {
  const response = await axiosInstance.post(`${BASEURL}/createReview`, {advisorId,userId,rating,review});
  return response.data;
};

export const getReviewsForAdvisor = async (advisorId: string) => {
  const response = await axiosInstance.get(`${advBASEURL}/getReviews/${advisorId}`);
  return response.data;
};

export const addReplyToReview = async (advisorId:string,reviewId: string, text: string) => {
  const response = await axiosInstance.post(`${advBASEURL}/addReply/${reviewId}`, {advisorId,text});
  return response.data;
};

export const updateReview = async (reviewId: string, rating: number, review: string) => {
  const response = await axiosInstance.patch(`${BASEURL}/${reviewId}`, { rating, review });
  return response.data;
};

export const deleteReview = async (reviewId: string) => {
  const response = await axiosInstance.delete(`${BASEURL}/${reviewId}`);
  return response.data;
};