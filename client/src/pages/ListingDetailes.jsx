import {useEffect,useState} from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import HashLoader from "react-spinners/HashLoader";
import {Swiper,SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../componentes/Contact.jsx';



const ListingDetailes = () => {
  SwiperCore.use([Navigation]) ;
  const [list,setList] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(false);
  const [copied,setCopied]  = useState(false);
  const [contact,setContact] = useState(false);
  const {currentuser} = useSelector((state) => state.user)
  const  params = useParams();
  
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {

      const fetchListing = async ()=>{
          try {   
            setLoading(true);
            const res = await fetch(`/api/listing/get/${params.listID}`)
            const data = await res.json();
            if(data.success === false){
              setLoading(false);
              setError(true);
              return;
            }
            console.log(data);
            setLoading(false);
            setError(false);
            setList(data);
          } catch (error) {
            setLoading(false);
            setError(true);  
          }
      };
      fetchListing();
    },250)
    
  },[params.listID])
   

  return (
    <main >
      
      {
        loading && 
        <div className='h-screen flex items-center justify-center'>

        <HashLoader
        color={"#5EEAD4"}
        loading={loading}
        size={75}
        aria-label="Loading Spinner"
        data-testid="loader"
        />
        </div>
      
      }
      {
        error && <p>Something went wrong</p>
      }
      {
        list && !loading && !error && 
           
            <div>
              <Swiper navigation>
                {
                  list.imageUrls.map((url) => (
                    <SwiperSlide key={url}>
                      <div 
                         className='h-[450px] bg-scale-66'
                         style={{ background: `url(${url}) center no-repeat `,
                         backgroundSize:'cover',
                         backgroundSize: 'cover',
                        '@media (min-width: 1024px)': {
                            backgroundSize: 'auto', // Change background size for large screens
                        }
                       }}
                      ></div> 
                    </SwiperSlide>
                  ))
                }
              </Swiper>
              <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                 <FaShare
                  className='text-black-500'
                  onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  },2000);
                  }}
                 />
              </div>
              {
                copied && (
                  <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                    Link copied!
                  </p>
                )
              }

              <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                <p className='text-2xl font-semibold'>
                    {list.name} - ${' '}
                    {list.offer
                       ? list.discountedPrice
                       : list.regularPrice
                    }
                    {list.type === 'rent' && '/month'}
                </p>

                <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                   <FaMapMarkerAlt className='text-green-700' />
                   {list.address}
                </p>
                <div className='flex gap-4'>
                  <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                      {list.type === 'rent' ? 'For Rent' : 'For Sale'}
                  </p>
                  {
                    list.offer && (
                      <p className='bg-teal-500 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                          ${+list.regularPrice - +list.discountedPrice} OFF
                      </p>
                    )
                  }
                </div>
                <p className='text-slate-800'>
                  <span className='font-semibold text-black'>Description - </span>
                    {list.description}
                </p>
                <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                  <li className='flex items-center gap-1 whitespace-nowrap '>
                      <FaBed className='text-lg' />
                          {list.bedrooms > 1
                    ? `${list.bedroom} beds `
                    : `${list.bedroom} bed `}
                  </li>
                  <li className='flex items-center gap-1 whitespace-nowrap '>
                      <FaBath className='text-lg' />
                        {list.bathrooms > 1
                        ? `${list.bathroom} baths `
                        : `${list.bathroom} bath `}
                  </li>
                  <li className='flex items-center gap-1 whitespace-nowrap '>
                      <FaParking className='text-lg' />
                        {list.parking ? 'Parking spot' : 'No Parking spot'}
                  </li>
                  <li className='flex items-center gap-1 whitespace-nowrap '>
                      <FaChair className='text-lg' />
                        {list.furnished ? 'Furnished' : 'Unfurnished'}
                  </li>
                </ul>
                {
                  currentuser && list.userRef !== currentuser._id && !contact && (
                    <button onClick={()=>setContact(true)} className='bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105'>Contact LandLord</button>
                  )
                }
                {
                  contact && <Contact list={list}/>
                }
              </div>
              
          </div>
                
      }
     
    </main>
  )
}

export default ListingDetailes