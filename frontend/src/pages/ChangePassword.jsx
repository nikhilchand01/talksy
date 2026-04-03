import { Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { changepassword } from '../lib/api';

const ChangePassword = () => {
  const { email } = useParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword]= useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const handleChangePassword= async()=>{
    setError("")
    setSuccess("")
    if(!newPassword || !confirmPassword){
      setError("Please fill in all fields");
      return;
    }
    if(newPassword !== confirmPassword){
      setError("Passwords didn't match");
      return;
    }
    try{
setIsLoading(true);
const res= await changepassword(email,
  newPassword,
  confirmPassword
)
setSuccess(res.data.message);
setTimeout(()=>{
  navigate('/login')
},2000);
    }catch(error){
      setError("Sending went wrong");
    }
  }
  return (
    <div className='min-h-screen flex items-center justify-center px-4' data-theme="night">
      <div className="border border-primary/25 shadow-md rounded-lg p-5 max-w-md w-full">
        <h2 className='text-3xl font-semibold text-center mb-2'>
          Change Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-4">Set a new Password for <span className='font-semibold text-blue-300'>{email}</span></p>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}
        <div className="space-y-4 ">
          <input className='input input-bordered w-full' type="password" placeholder='New Password' value={newPassword} onChange={(e)=> setNewPassword(e.target.value)}/>
          <input className='input input-bordered w-full' type="password" placeholder='Confirm Password' value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)}/>
          <button onClick={handleChangePassword} className="btn btn-primary w-full" disabled={isLoading} >
            {
              isLoading ? <>
                <Loader2 className='mr-2 w-4 h-4 animate-spin' />Changing
              </> : "Change Password"
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword