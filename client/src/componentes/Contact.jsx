import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Contact = ({list}) => {

  const [landlord,setLandlord] = useState(null);
  const [message,setMessage] = useState("");
    useEffect( () => {
        const fetchLandLord = async () => {
            try {
                const res = await fetch(`/api/user/${list.userRef}`);
                const data = await res.json();
                setLandlord(data);
                
            } catch (error) {
                console.log(error);
            }
        }
        fetchLandLord();
    },[list.userRef])

    const handleChange = (e) => {
        setMessage(e.target.value)
        
    }
    
  return (
    <>
        {
            landlord && (
                <div className='flex flex-col gap-4'>
                    <p>Conatct <span className='font-bold'>{landlord.username}</span> for <span className='font-bold '>{list.name.toLowerCase()}</span></p>

                    <textarea name="message" id="message" rows="3" className='w-full p-3 rounded-lg' placeholder="Enter Your Message" onChange={handleChange}></textarea>
                    <Link 
                        to={`mailto:${landlord.email}?subject=Regarding ${list.name}&body=${message}`}
                        className='bg-emerald-900 w-full  text-white text-center p-3 rounded-md hover:opacity-95 transition ease-in-out'
                    >
                        Send Message
                    </Link>
                </div>
            )
        }
    </>
  )
}

export default Contact