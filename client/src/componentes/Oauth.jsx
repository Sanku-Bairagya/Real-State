import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { app } from '../../firebase.js';
import { useDispatch } from 'react-redux';
import {signInSuccess} from "../redux/user/userSlice.js"
import { useNavigate } from 'react-router-dom';
const Oauth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleAuth = async () => {
    
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth,provider);

      
      const res = await fetch('/api/auth/google',
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(
          {
            name:result.user.displayName,
            email:result.user.email,
            photo:result.user.photoURL,
          }
        )
      }
      )
     const data = await res.json();
     

     dispatch(signInSuccess(data));

     navigate('/');

    } catch (error) {
     console.log("Can't sign-in or sign-up for new user through google ",error.message);
    }
  }


  return (
    <button onClick={handleAuth} type='button' className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors duration-300 uppercase">
      
        Continue with Google
    </button>
  )
}

export default Oauth