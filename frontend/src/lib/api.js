import { axiosInstance } from "./axios.js";

export const signup= async (signupData)=>{
    const response= await axiosInstance.post("/auth/signup", signupData);
    return response.data;
}
export const login = async (loginData)=>{
    const response= await axiosInstance.post("/auth/login", loginData);
    return response.data;
}
export const getAuthUser= async()=>{
      try{
        const res=await axiosInstance.get("/auth/me");
      return res.data;
      }catch(error){
        return null;
      }
    }

export const verifyEmail= async(token)=>{
  const response=await axiosInstance.post(`/auth/verify/${token}`);
  return response.data;
}
export const verifyOtp = async({email, otp})=>{
  const response= await axiosInstance.post(`/auth/verifyotp/${email}`,{otp});
  return response;
}
export const logout = async ()=>{
    const response= await axiosInstance.post("/auth/logout");
    return response.data;
}

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboard", userData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const forgotPassword = async(email) => {
  const response = await axiosInstance.post("/auth/forgotpassword", {email});
  return response;
}
export const changepassword= async(email, newPassword, confirmPassword)=>{
  const response = await axiosInstance.post(`/auth/changepassword/${email}`, {newPassword, confirmPassword});
  return response;
}

export const getUserFriends =async()=>{
  const response= await axiosInstance.get("/users/friends");
  return response.data;
}
export const getRecommendedUsers =async()=>{
  const response= await axiosInstance.get("/users");
  return response.data;
}
export const getOutgoingFriendReqs =async()=>{
  const response= await axiosInstance.get("/users/outgoing-friend-requests");
  console.log(response.data);
  return response.data;
}
export const sendFriendRequest =async(userId)=>{
  const response= await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}
export const getFriendRequests =async()=>{
  const response= await axiosInstance.get(`/users/friend-requests`);
  return response.data;
}
export const acceptFriendRequest =async(requestId)=>{
  const response= await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  console.log(response);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}
