import { Link } from 'react-router';
import useAuthUser from '../hooks/useAuthUser'
import { useLocation } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {ShipWheelIcon, BellIcon, LogOutIcon } from 'lucide-react';
import { logout } from '../lib/api';

const Navbar = () => {
    const {authUser}= useAuthUser();
    const location= useLocation();
    const isChatPage= location.pathname?.startsWith("/chat");
    const queryClient= useQueryClient();

     const {mutate: logoutMutation}= useMutation({
        mutationFn: logout,
        onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["authUser"]})
     })

  return (
    <nav className="bg-base-200 border-base-300 sticky top-0 z-30 h-16 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-end w-full">
                {isChatPage && (
                    <div className="pl-5">
                        <Link to="/" className="flex items-center gap-2.5">
                        <ShipWheelIcon className="size-9 text-primary"/>
                        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                            Talksy
                            </span>                        
                        </Link>
                    </div>
                )}
                <div className="flex items-center gap-7 sm:gap-5 ml-auto">
                      <Link to={"/notifications"}>
                      <button className="btn btn-ghost btn-circle">
                        <BellIcon className='h-7 w-6 text-base-content opacity-90'/>
                      </button>
                      </Link>
                </div>
                <div className="avatar">
                    <Link to={"/userProfile"}>
                    <div className="w-8 rounded-full">
                        <img src={authUser?.profilePic} alt="User Avatar" />
                    </div>
                    </Link>
                </div>
                <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
                    <LogOutIcon className='h-6 w-6 text-base-content opacity-90'/>
                </button>
            </div>
        </div>
    </nav>
  )
}

export default Navbar