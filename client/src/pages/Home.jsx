import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'

import {Swiper,SwiperSlide} from 'swiper/react';
import 'swiper/css/bundle'
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import ListingItem from "../componentes/ListingItem.jsx"


const Home = () => {

  const [offerListings,setOfferListings] = useState([]);
  const [saleListings,setSaleListings] = useState([]);
  const [rentListings,setRentListings] = useState([]);
  SwiperCore.use(Navigation)
  console.log(saleListings);

  useEffect(() =>{
    const fetchOfferListing = async () => {
      try {
        const res = await fetch ('/api/listing/get?offer=true&limit=4')
        const data = await res.json();
        setOfferListings(data);
        fetchRentListing();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchRentListing = async () => {
      try {
        const res = await fetch ('/api/listing/get?type=rent&limit=4')
        const data = await res.json();
        setRentListings(data);
        fetchSaleListing();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchSaleListing = async () => {
      try {
        const res = await fetch ('/api/listing/get?type=sale&limit=4')
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchOfferListing();
  },[])


  return (
    <div className="">

     <div className="flex flex-col gap-4 p-28 px-3 max-w-6xl  mx-auto">
      <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl mb-8'>
        Find Your next <span className='text-slate-500'>perfect</span> <br /> place with ease .😊
      </h1>
      <div className="text-gray-400 text-xs sm:text-sm">
          Dive into the ease of finding your dream home with    our user-friendly listings. Experience seamless   searching and discover your perfect property.
          <br />
          We have a wide range of properties for you to choose from .
      </div>
      <Link to={"/search"} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
          Let's get started ... 
      </Link>
     </div>


     { /* swiper for sale items */}
      <Swiper navigation>

      {
        offerListings && offerListings.length > 1 && 
        offerListings.map((listing) => (
          <SwiperSlide>
            <div 
             style={{background:`url(${listing.imageUrls[0]}) center no-repeat  `,
            backgroundSize:"cover" }}
             className="h-[550px]" key={listing._id}>

            </div>
          </SwiperSlide>
        ))
      }
      </Swiper>

      { /*listing results for others */}

      <div className="max-w--6xl mx-auto p-3 flex flex-col gap-10 my-10 px-16">
          {
             offerListings && offerListings.length > 0 && (
                <div className="">
                    <div className="my-3">
                      <h2 className='text-2xl font-semibold text-slate-600 '> Recent Offers</h2>
                      <Link to={'/search?offer=true'} className='font-semibold text-sm text-blue-800 hover:underline'>
                          Show More offers ...
                      </Link>
                    </div>
                    <div className=" flex flex-wrap gap-5">
                      {
                        offerListings.map((listing) => (
                            <ListingItem listing={listing} key={listing._id}/>
                        ))
                      }
                    </div>
                </div>
             )
          }
           {
             rentListings && rentListings.length > 0 && (
                <div className="">
                    <div className="my-3">
                      <h2 className='text-2xl font-semibold text-slate-600 '> Recent places for rent</h2>
                      <Link to={'/search?type=rent'} className='font-semibold text-sm text-blue-800 hover:underline'>
                          Show More places for rent ...
                      </Link>
                    </div>
                    <div className=" flex flex-wrap gap-5">
                      {
                        rentListings.map((listing) => (
                            <ListingItem listing={listing} key={listing._id}/>
                        ))
                      }
                    </div>
                </div>
             )
           }
           
           {
             saleListings && saleListings.length > 0 && (
                <div className="">
                    <div className="my-3">
                      <h2 className='text-2xl font-semibold text-slate-600 '> Recent Places for sale</h2>
                      <Link to={'/search?type=sale'} className='font-semibold text-sm text-blue-800 hover:underline'>
                          Show More places for sale ...
                      </Link>
                    </div>
                    <div className=" flex flex-wrap gap-5">
                      {
                        saleListings.map((listing) => (
                            <ListingItem listing={listing} key={listing._id}/>
                        ))
                      }
                    </div>
                </div>
             )
           }
      </div>
      
    </div>

  )
}

export default Home