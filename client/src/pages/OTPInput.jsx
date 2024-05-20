import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const VerifyOTP = ({ email }) => {
  
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  


  useEffect(() => {

    if (timer > 0) {
      const countdown = setInterval(() => {
       setTimer(prevTimer => prevTimer - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);


  // verify the OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (data.success) {
      setMessage('OTP verified successfully.');
      alert('OTP verified successfully.')
      navigate('/reset-password');  // Navigating to reset password
    } else {
      setMessage('Invalid OTP. Please try again.');
    }
  };

  // code for resend OTP
  const handleResendOTP = async () => {
    setCanResend(false);
    setTimer(60);

    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (data.success) {
      setMessage('OTP resent successfully');
    } else {
      setMessage('Failed to resend OTP. Please try again.');
    }
  };


  console.log(otp)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h2 className="text-3xl font-semibold text-center my-7">Verify OTP</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        
        <input 
             type="text"
             value={otp}
             onChange={(e) => setOtp(e.target.value)}
             required
             className='border p-3 rounded-lg'
        />
        
        
        <button type="submit" className='text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 uppercase mt-6'>Verify OTP</button>
      </form>
      {message && <p className='text-green-700 mt-5 font-semibold'>{message}</p>}
      {canResend ? (
        <button onClick={handleResendOTP} className='flex bg-teal-400 rounded-lg p-2 font-semibold text-l hover:bg-teal-600 mt-6 mx-auto'>Resend </button>
      ) : (
        <p className='text-blue-500 text-lg '>Didn't get OTP ? Resend OTP in {timer}s</p>
      )}
    </div>
  );
};

export default VerifyOTP;