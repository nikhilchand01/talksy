import {Navigate, Route, Routes} from "react-router";
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import CallPage from './pages/CallPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import OnBoardingPage from './pages/OnBoardingPage.jsx';
import {Toaster} from "react-hot-toast";
import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';
import Layout  from "./components/Layout.jsx";
import FriendsPage from "./pages/FriendsPage.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Verify from "./pages/Verify.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";

 const App = () => {
 
 const {isLoading, authUser}= useAuthUser();

 const isAuthenticated = Boolean(authUser);
 const isOnboarded= authUser?.isOnboarded;
 const isVerified= authUser?.isVerified;

  if(isLoading) return <PageLoader />;
  return (
    <div className='h-screen' data-theme="night">
      <Routes>
       
        <Route path="/" element={isAuthenticated && isOnboarded  ? (
          <Layout showsidebar={true}>
          <HomePage />
          </Layout>
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>
        ) }/>
       <Route path="/verify" element={<VerifyEmail/>}/>

        <Route path="/signup" element={!isAuthenticated ? <SignUpPage/> :  <Navigate to={isVerified  ? "/" : "/verify"} />
}/>
        <Route path="/verify/:token" element={<Verify/>}/>

        <Route path="/login" element={!isAuthenticated ? <LoginPage/> : <Navigate to= {isOnboarded ? "/" : "/onboarding"} />}/>
        <Route path="forgotpassword" element={<ForgotPassword/>}/>
        <Route path="/verify-otp/:email" element={<VerifyOtp/>}/>
        <Route path="/changepassword/:email" element={<ChangePassword/>}/>
         <Route path="/friends" element={isAuthenticated && isOnboarded ? (
          <Layout showsidebar={true}>
            <FriendsPage />
          </Layout>
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        )}/>
        
<Route path="/" element={isAuthenticated && isOnboarded ? (
          <Layout showsidebar={true}>
            <HomePage />
          </Layout>
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        )}/>
        

        <Route path="/notifications" element={isAuthenticated && isOnboarded ? (
          <Layout showsidebar={true}>
            <NotificationsPage />
          </Layout>
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        )}/>
        
        <Route path="/call/:id" element={isAuthenticated && isOnboarded ? (
          <CallPage />
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        )}/>
        <Route path="/chat/:id" element={isAuthenticated && isOnboarded ? (
          <Layout showsidebar={false}>
            <ChatPage />
          </Layout>
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>
        )}  />
        <Route path="/onboarding" element={isAuthenticated ? (
          !isOnboarded ? (
            <OnBoardingPage />
          
        ) : (
          <Navigate to="/" />
        ) ) : (<Navigate to="/login" />

        )}/>
       
      </Routes>
<Toaster />
    </div>
  )
}

export default App;
