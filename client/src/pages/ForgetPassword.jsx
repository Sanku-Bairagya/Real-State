import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HashLoader from "react-spinners/HashLoader";
const ForgotPassword = ({ onEmailSent }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res  = await fetch('/api/send-otp',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (data.success) {
      setLoading(false);
      alert('OTP has been sent to your email.');
      onEmailSent(email);
      navigate('/verify-otp');  // Navigate to verify-otp route
    }
    else{
      alert("Please enter your valid email");
      setLoading(false);
    }

  }
  return (
    <div className='p-3 max-w-lg mx-auto'>

   {
      loading && <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div className="w-full items-center flex h-screen justify-center"> 
                <HashLoader
                color={"#5EEAD4"}
                loading={loading}
                size={75}
                aria-label="Loading Spinner"
                data-testid="loader"
                />
            </div>  
      </div>
   }
      
      <h2 className="text-3xl font-semibold text-center my-7">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
              type="email" 
              placeholder='email'
              className='border p-3 rounded-lg'
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              required
          />
          <button type='submit' className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 uppercase">
              {loading ? "Sending" : "Send"}
          </button>
      </form>
      
    </div>
  );
};

export default ForgotPassword;
