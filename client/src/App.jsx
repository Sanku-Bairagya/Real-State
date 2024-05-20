import './App.css';
import React,{useState} from 'react'
import Home from "./pages/Home.jsx"
import About from "./pages/About.jsx"
import SignIn from "./pages/SignIn.jsx"
import SignUp from "./pages/SignUp.jsx"
import Profile from "./pages/Profile.jsx"
import {BrowserRouter,Routes,Route,useNavigate} from 'react-router-dom'

import Header from './componentes/Header.jsx'
import PrivateRoute from './componentes/PrivateRoute.jsx'
import CreateListing from './pages/CreateListing.jsx'
import ShowListing from './pages/ShowListing.jsx'
import UpdateListing from './pages/UpdateListing.jsx'
import ListingDetailes from './pages/ListingDetailes.jsx'
import Search from './pages/Search.jsx';
import OTPInput from './pages/OTPInput.jsx';
import Reset from './pages/Reset.jsx';
import ForgetPassword from "./pages/ForgetPassword.jsx";



const App = () => {
  const [email,setEmail] = useState('');
  const handleEmailSent = (email) => {
    setEmail(email);
  };
   

  return (
   <BrowserRouter>
     <Header/>
     
     <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/about" element={<About />} />
       <Route path="/sign-in" element={<SignIn />} />
       <Route path="/sign-up" element={<SignUp />} />
       <Route path="/listUP/:listID" element={<ListingDetailes />} />
       <Route path="/search" element={<Search/>} />
       <Route
         path="/forgotpassword"
         element={<ForgetPassword onEmailSent={handleEmailSent} />}
        />
      <Route
          path="/verify-otp"
          element={<OTPInput email={email} />}
      />
      <Route
         path="/reset-password"
         element={<Reset email={email} />}
      />
       <Route element={<PrivateRoute/>}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing/>} />
          <Route path='/show-listing' element={<ShowListing/>} />
          <Route path='/update-listing/:listingId' element={<UpdateListing/>} />
       </Route>
      
     </Routes>
   </BrowserRouter>
  )
}

export default App
