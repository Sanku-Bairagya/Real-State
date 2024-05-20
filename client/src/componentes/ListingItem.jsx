import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
const ListingItem = ({listing}) => {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg sm:w-[330px]'>
      <Link to={`/listUP/${listing._id}`}>
        <img src={listing.imageUrls[0] || "https://wallpapers.com/images/hd/real-estate-digital-art-0kmi22tcj2x60lim.jpg"} alt="Listing Cover" 
        className='mb-5 h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300 '/>
      
      <div className="p-3 flex flex-col gap-2 w-full">
        <p className='text-lg  font-bold text-slate-600 italic truncate'>{listing.name}</p>
        <div className='flex  items-center gap-2'>
            <MdLocationOn className='h-4 w-4 text-green-700'/>
            <p className='font-semibold text-yellow-700 truncate w-full'>{listing.address}</p>
        </div>
        <p className='text-sm font-semibold text-slate-500 line-clamp-2'>{listing.description}</p>
        <p className='text-green-500 font-semibold text-lg mt-2'>
          $
          {
            listing.offer ? listing.discountedPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')
          }
          {
            listing.type === 'rent' && '/ month'
          }
        </p>
        <div className="text-green-700 flex gap-4">
          <div className="font-semibold text-x5 ">
            {listing.bedroom > 1 ?  `${listing.bedroom} beds` : `${listing.bedroom} bed`}
          </div>
          <div className="font-semibold text-x5 ">
            {listing.bathroom > 1 ?  `${listing.bathroom} baths` : `${listing.bathroom} bath`}
          </div>
        </div>
      </div>
      </Link>
    </div>
  )
}

export default ListingItem