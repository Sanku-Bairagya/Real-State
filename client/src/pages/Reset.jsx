import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {BsEyeSlash,BsEye} from 'react-icons/bs'

const Reset = ({ email }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matchedPass,setMatchedPass] = useState(false)
  const [message, setMessage] = useState('');
  const [visible,setVisible] = useState(false);
  // const [validationMessage, setValidationMessage] = useState('');
  // const [perfectPass,setPerfectPass] = useState(true);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMatchedPass(true);
      return;
    }
    
    const response = await fetch('/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.success) {
      setMessage('Password reset successfully.');
      navigate('/sign-in');
    } else {
      setMessage('Error resetting password. Please try again.');
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setPassword(val);

    // const message = validatePassword(val); 
    // setValidationMessage(message);
  }

  // const validatePassword = () => {
  //   const minLength = 8;
  //   const messages = [];

  //   if (password.length < minLength) {
  //     setPerfectPass(false);
  //     messages.push('Password must be at least 8 characters long.');
  //     return;
  //   }
  //   if (!/[A-Z]/.test(password)) {
  //     setPerfectPass(false);
  //     messages.push('Password must include at least one uppercase letter.');
  //     return;
  //   }
  //   if (!/[a-z]/.test(password)) {
  //     setPerfectPass(false);
  //     messages.push('Password must include at least one lowercase letter.');
  //     return;
  //   }
  //   if (!/\d/.test(password)) {
  //     setPerfectPass(false);
  //     messages.push('Password must include at least one number.');
  //     return;
  //   }
  //   if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
  //     setPerfectPass(false);
  //     messages.push('Password must include at least one special character.');
  //     return;
  //   }

  //   return messages;
  //  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h2 className='text-3xl font-semibold text-center my-7'>Reset Password</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <div className=" flex justify-between border items-center  rounded-lg text-green-600 font-semibold w-300px bg-gray-50 ">
          <input
            type={visible ? 'text' : 'password'}
            value={password}
            placeholder='Enter New Password'
            className='focus:outline-none p-3 rounded-lg text-green-600 font-semibold w-full'
            onChange={(e) => handleChange(e)}
            required
          />
          <div className='p-4 bg-[#FFFFFF]' onClick={() => setVisible(!visible)}>
                    {
                    visible ? <BsEye/> : <BsEyeSlash />
                    }
          </div>
        </div>  
        
        <div className=" flex justify-between border items-center  rounded-lg text-green-600 font-semibold w-300px bg-gray-50 ">
          <input
            type={visible ? 'text' : 'password'}
            value={confirmPassword}
            placeholder='Confirm Password'
            className='focus:outline-none p-3 rounded-lg text-green-600 font-semibold w-full'
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          
          <div className='p-4 bg-[#FFFFFF]' onClick={() => setVisible(!visible)}>
                    {
                    visible ? <BsEye/> : <BsEyeSlash />
                    }
          </div>
        </div>
        
          {
              matchedPass && <p className='text-red-700 mt-5 font-semibold'>Passowrd is not matched !</p>
          }
        
        <button type="submit" className='bg-teal-400 rounded-lg p-3 font-bold text-xl hover:bg-teal-600'>Reset Password</button>
      </form>
      {message && <p className='text-green-700 mt-5 font-semibold'>{message}</p>}
    </div>
  );
};

export default Reset;
