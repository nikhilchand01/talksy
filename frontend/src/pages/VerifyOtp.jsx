import React, { useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, Input } from '@mui/material';
import { CheckCircle, Loader2, RotateCcw } from 'lucide-react';
import { verifyOtp } from '../lib/api';
import { TextField, Button } from "@mui/material";
import { useNavigate, useParams } from 'react-router';

const VerifyOtp = () => {
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs= useRef([]);
    const {email}= useParams();
    const navigate=useNavigate();

    const handleChange = (index, value) => {
        if (value.length > 1) return
        const updatedOtp= [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);
        if(value && index < 5){
            inputRefs.current[index + 1]?.focus()
        }
    }
    const handleVerify = async()=>{
        const finalOtp = otp.join("")
        if(finalOtp.length !== 6){
            setError("Please enter all 6 digit");
            return;
        }
        try{
            setIsLoading(true);
            const res =await verifyOtp({email, otp:finalOtp});
            setSuccessMessage(res.data.message);
            setTimeout(()=>{
navigate(`/changePassword/${email}`);
            },2000)
        }catch(error){
            setError(error.response?.data?.message);
        }finally{
            setIsLoading(false);
        }
    }
    const clearOtp=()=>{
        setOtp(["", "", "", "", "", ""]);
        setError("");
        inputRefs.current[0]?.focus()
    }
    return (
        <div className="min-h-screen flex flex-col" data-theme='night'>
            <div className="border border-primary/25 flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary'>Verify Your Email</h1>
                        <p className='text-grey'>We've sent a 6-digit verification code <to>" "</to><span>{"Your email"}</span></p>
                    </div>
                    <Card className="shadow-lg">
                        <CardHeader className='space-y-1'>
                            <CardTitle className='text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary'>Enter Verification Code</CardTitle>
                            <CardDescription className='text-center text-grey'>
                                {
                                    isVerified ? "Code Verified Successfully! Redirecting..." : "Enter the 6-digit code sent to your email"
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            {error && (
  <div className="alert alert-error">
    <span>{error}</span>
  </div>
)}

                            {successMessage && <p className='text-blue-300 text-sm mb-3 text-center'>{successMessage}</p>}
                            {isVerified ? (
                                <div className='py-6 flex flex-col items-center justify-center text-center space-y-4'>
                                    <div className="bg-primary/10 rounded-full p-3">
                                        <CheckCircle className='h-6 w-6 text-primary' />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-lg">Verification Successfull</h3>
                                        <p className="text-grey">Your email has been verified. You will will be redirected to reset your password </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Loader2 className='h-4 w-4 animate-spin' />
                                        <span className="text-sm text-muted-foreground">Redirecting....</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between mb-6">
                                        {
                                            otp.map((digit, index) => (
                                                <input key={index} type="text" value={digit} onChange={(e)=>handleChange(index, e.target.value)} ref={(el)=>{inputRefs.current[index]=el}} maxLength={1} className='w-12 h-12 text-center text-xl font-bold' />
                                            ))
                                        }
                                    </div>
                                    <div className="space-y-3">
                                        <button onClick={handleVerify} className="btn btn-primary w-full" disabled={isLoading || otp.some((digit) => digit === "")}>
                                            {
                                                isLoading ? <>
                                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />Verifying
                                                </> : "Verify Code"
                                            }
                                        </button>
                                        <button variant='outline' onClick={clearOtp} className='btn btn-primary w-full ' disabled={isLoading || isVerified}>
                                            <RotateCcw className='mr-2 h-4 w-4'/> Clear</button>
                                    </div>
                                </>
                            )
                            }

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default VerifyOtp