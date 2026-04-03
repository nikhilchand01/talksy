import { CheckCircle, FileX, Loader2 } from 'lucide-react';
import { CardDescription, Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router';
import { forgotPassword } from '../lib/api.js';
import toast from 'react-hot-toast';

const ForgotPassword = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();
const handleForgotPassword = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const res = await forgotPassword(email);
    if (res?.data?.success) {
      navigate(`/verify-otp/${email}`);
      toast.success("Email Sent Successfully");
    } else {
     console.log("error sending otp ",error);
    }
  } catch (error) {
    console.error("Forgot password error:", error);
  } finally {
    setIsLoading(false);
  }
};
    return (
        <div className='relative w-full overflow-hidden' data-theme="night">
            <div className="min-h-screen flex flex-col">
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-md space-y-6">
                        <div className="text-center space-y-2">
                            <h1 className='text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary'>Reset Your Password</h1>
                            <p className='text-muted-foreground'>Enter your Email address and we'll send you instructions to reset your password</p>
                        </div>
                        <Card>
                            <CardHeader className='space-y-1'>
                                <CardTitle className='text-2xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary'>Forgot Password</CardTitle>
                                <CardDescription className='text-center text-grey'>
                                    {
                                        isSubmitted ? "Check your email for reset instructions" : "Enter your email address to recieve a password reset link"
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                {
                                    error && (
                                        <div className="alert alert-error mb-4">
                                            <span>{error.response.data.message}</span>
                                        </div>
                                    )
                                }
                                {
                                    isSubmitted ? (
                                        <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                                            <div className="bg-primary/10 rounded-full p-3">
                                                <CheckCircle className='h-6 w-6 text-primary' /></div>
                                            <div className="space-y-2">
                                                <h3 className="font-medium text-lg">Check Your Inbox</h3>
                                                <p className="text-muted-foreground">We've sent a password reset link to <span className='font-medium text-foreground'>{email}</span> </p>
                                                <p>If you don't see the email, check your spam folder or{" "}
                                                    <button className='text-primary hover:underline font-medium' onClick={() => setIsSubmitted(false)}>try again</button>
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleForgotPassword} className='space-y-4'>
                                            <div className="space-y-2 relative text-gray-800">
                                            
                                                <input type="email" className='input w-full text-white' placeholder='Enter your email' value={email} onChange={(e)=>setEmail(e.target.value)} required disabled={isLoading} />
                                            </div>
                                            <button className=' btn btn-secondary w-full text-white hover:bg-blue-500 cursor-pointer'>
                                                {
                                                    isLoading ? (
                                                        <>
                                                        <Loader2 className='mr-2 h-4 w-4 animate-spin'/>Sending reset link...
                                                        </>
                                                    ):("send reset link")
                                                }
                                            </button>
                                        </form>
                                        
                                    )
                                }
                            </CardContent>
                            <CardFooter className='flex justify-center'>
                                <p className='text-grey'>
                                    Remember your password?{" "}
                                    <Link to={'/login'} className='text-blue-00 hover:underline font-medium relative'>Sign In</Link>
                                </p>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword