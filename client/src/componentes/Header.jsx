import React, { useEffect, useState } from 'react'
import {FaSearch} from 'react-icons/fa'
import {Link,useNavigate} from 'react-router-dom'
import {useSelector} from "react-redux"


const Header = () => {
  const {currentuser} = useSelector(state => state.user);
  const navigate = useNavigate();
  const [searchTerm,setSeachTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm',searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);

  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.Location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSeachTerm(searchTermFromUrl);
    }
  },[location.seach])

  return (
    <header className='bg-teal-300 shadow-md'>
      <div className='flex justify-between item-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl felx flex-wrap'>
            <span className='text-green-700'>Nest</span>
            <span className='text-blue-800'>Quest</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className='bg-white p-2 rounded-lg flex items-center border-solid'>
          <input 
            type="text" 
            placeholder='Search ...' 
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSeachTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-gray-700"/>
          </button>

        </form>
        <ul className='flex gap-10'>
          <Link to='/'>
            <li className='hidden sm:inline text-blue-700 hover:text-blue-400 font-bold'>Home</li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-blue-700 hover:text-blue-400 font-bold'>About</li>
          </Link>
          <Link to='/profile'>
          {
            currentuser?
            (
              <img className='rounded-full h-9 w-9 object-cover' src={currentuser.avatar} alt="" />
            )
            :
            (
              <li className=' sm:inline text-blue-700 hover:text-blue-400 font-bold'>Sign In</li>
            )

          }

          </Link>
              
            
          
        </ul>
      </div>
      
    </header>
  )
}

export default Header