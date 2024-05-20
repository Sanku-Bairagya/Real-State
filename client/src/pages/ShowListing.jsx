import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom' 
import { useEffect } from 'react'
import HashLoader from "react-spinners/HashLoader";


const ShowListing = () => {
  const {currentuser} = useSelector(state => state.user)
  const [showlistingsError,setShowlistingsError] = useState(false);
  const [userListings,setUserListings] = useState([]);
  
  const [loading ,setLoading] = useState(true);

   
  useEffect(()=> {

    setTimeout(() =>{
      
      const fetchAllListing = async () => {
        
        try {
          setLoading(true);
          setShowlistingsError(false);
          const res = await fetch(`/api/user/listings/${currentuser._id}`);
          const data = await res.json();
    
          if(data.success === false){
              setShowlistingsError(true);
              setLoading(false);
              return;
          } 
          setUserListings(data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setShowlistingsError(true);
        }
      }
       fetchAllListing();
    },6000)
  
  },[])


  

  const handleListingDelete = async (listingID) => {

    try {
      const res = await fetch(`api/listing/delete/${listingID}`,{
        method:'DELETE',
      });
      const data  = await res.json();

      if(data.success === false){
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingID));

    } catch (error) {
      console.log(error.message);
    }
    
  }

  return (
    <>
        {
          loading && ( <div className='fixed inset-0 bg-black bg-opacity-50 z-50'>

            <div className="w-full items-center flex h-screen  justify-center "> 
                <HashLoader
                color={"#5EEAD4"}
                loading={loading}
                size={75}
                aria-label="Loading Spinner"
                data-testid="loader"
                />
            </div>  
          </div>
        )
        }
      
       { !loading && userListings && userListings.length > 0 &&
       
       userListings.map((listing) => (
          
          <main key={listing._id} className='p-3 max-w-4xl mx-auto border m-2 bg-gray-100 shadow-md m-5 gap-3'>
                    
                    {
                      listing.imageUrls.map((imageUrl,idx) => 
                      <div key={idx} className='flex justify-between p-3 border items-center mt-2 rounded-lg '>
                       
                          <img key={idx} src={imageUrl} alt=""  className='w-20 h-18 object-contain rounded-lg border-black border-1 '/> 
                          <p className='font-bold text-m text-teal-800 hover:underline truncate'>{listing.name}</p>
                        
                        
                      </div>
                    )
                    }
                    <div className='flex  gap-3 w-20 mx-auto'>
                        <button onClick={()=>handleListingDelete(listing._id)} className='bg-red-400 p-2 text-black font-bold rounded-lg border-black hover:bg-red-200 mt-2'>Delete</button> 
                        <Link to={`/update-listing/${listing._id}`}>
                          <button className='bg-green-400 p-2 text-black font-bold rounded-lg border-black hover:bg-green-200 mt-2 px-4'>Edit</button>
                        </Link>
                    </div>
          </main>

       ))
         
       }

    </>
  )
}

export default ShowListing

//w-20 h-18 object-contain rounded-lg border-black border-1 