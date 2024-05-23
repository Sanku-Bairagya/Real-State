import react, { useEffect, useRef, useState } from "react"
import { useNavigate } from 'react-router-dom';

const OTPInput = ({ email }) => {
   
    const [otp,setOtp] = useState(new Array(6).fill(""));
    const [finalotp,setFinalotp] = useState("")
    const [timer, setTimer] = useState(60);
    const [message, setMessage] = useState('');
    const [canResend, setCanResend] = useState(false);
    const navigate = useNavigate();
    const inputRefs = useRef([]);

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

    useEffect(() => {
       if(inputRefs.current[0]){
        inputRefs.current[0].focus();
       }
    },[])


    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, finalotp }),
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

    
    const handleChange = (index,e) => {
        const value = e.target.value;
        if(isNaN(value)){
            return;
        }
        const newOtp = [...otp];
        //allowing only one input
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        //submit trigger 
        const combinedOtp = newOtp.join("");
        
        console.log(newOtp,combinedOtp);

        if(combinedOtp.length === 6){
            setFinalotp(combinedOtp);
        }

        if(value && index<5 && inputRefs.current[index+1]){
          inputRefs.current[index + 1].focus();
        }

    }

    const handleClick = () => {

    }
    const handleKeyDown = (index,e) => {
        if(e.key==="Backspace" && !otp[index] && index > 0 && inputRefs.current[index-1]){
          inputRefs.current[index - 1].focus();
        }
    }

    return <>
    <div className=' max-w-lg mx-auto '>
    <h2 className="text-3xl font-semibold text-center my-7">Verify OTP</h2>
     
      
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center flex-nowrap px-9">
          <div className="">
           {
            otp.map((value,index) =>{
                return (
                  
                    <input
                      className="border rounded-lg w-11 h-11 m-1 text-center font-semibold m-"
                      key={index}
                      type="text"
                      ref={(input) => (inputRefs.current[index] = input)}
                      value={value}
                      onChange={(e) => handleChange(index,e)}
                      onClick={() => handleClick(index)}
                      onKeyDown={(e) => handleKeyDown(index,e)}
                    />
                  
                );
            } )
           }
          </div>
          
        <div className="p-5 w-full items-center">

        <button type="submit" className='mx-auto text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 uppercase mt-6 w-full'>Verify OTP</button>
        </div>
        </form>
      
        
        <div className="flex justify-center">
        {canResend ? (
            <button onClick={handleResendOTP} className='flex bg-teal-400 rounded-lg p-2 font-semibold text-l hover:bg-teal-600 mt-6 mx-auto'>Resend </button>
        ) : (
            <p className='text-blue-500 text-lg '>Didn't get OTP ? Resend OTP in {timer}s</p>
        )}
        </div>
     


    </div>
    </>
}

export default OTPInput