import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { verifyEmail } from '../lib/api.js';

const Verify = () => {
    const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");

  const { data, isLoading, isError} = useQuery({
    queryKey: ["verify", token],
    queryFn: () => verifyEmail(token),
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (isLoading) {
      setStatus("Verifying...");
    } else if (isError) {
      setStatus("❌ Verification Failed. Please try again");
    } else if (data?.success) {
      setStatus("✅ Email Verified Successfully");
      //toast.success(" ✅ Email Verified ")
      setTimeout(() => {
        navigate("/onboarding");
      }, 2000);
    } else {
      setStatus("❌ Invalid or Expired Token");
    }
  }, [isLoading, isError, data, navigate]);
    
  return (
    <div className='relative w-full h-[760px] bg-blue-100 overflow-hidden '>
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-md text-center w-[90%] max-w-md">
                <h2 className="text-xl font-semibold text-gray-800">{status}</h2>
            </div>
        </div>
    </div>
  )
}

export default Verify