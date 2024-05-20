import React, { useState, useEffect } from 'react'
import { useRef } from 'react'
import {app} from '../../firebase.js'
import { useSelector,useDispatch } from 'react-redux'
import { getDownloadURL, getStorage , ref, uploadBytesResumable } from "firebase/storage"
import { 
   updateFailure,
   updateStart,
   updateSuccess,
   deleteFailure,
   deleteStart,
   deleteSuccess,
   outSuccess,
   outStart,
   outFailure 
  } from '../redux/user/userSlice.js'
  import { Link } from 'react-router-dom'
  import {BsEyeSlash,BsEye} from 'react-icons/bs'



const Profile = () => {
  const fileReference = useRef(null); 
  const {currentuser,loading,error} = useSelector((state) => state.user)
  const [file,setFile] = useState(undefined);
  const [filepercent,setFilepercent] =  useState(0);
  const [updSuccess,setUpdSuccess] = useState(null);
  const [password,setPassword] = useState("");
  const [visible,setVisible] = useState(false);
  const [fileerror,setFileerror] = useState(false);

  const [formData,setFormData] = useState({})

  const dispatch = useDispatch();

  console.log(`${filepercent} %`);

  useEffect(()=> {
    if(file){
      handleFileUpload(file);
    }
  },[file]);

  const handleFileUpload  = (file) => {

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage,fileName);

    const uploadTask = uploadBytesResumable(storageRef,file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilepercent(Math.round(progress));
      },
    

    (error) => {
      setFileerror(true);
    },

    
    // to get the file

    () => {
     getDownloadURL(uploadTask.snapshot.ref)
      .then((downloadURL) => {
        setFormData({...formData, avatar:downloadURL});
      })
    }
    );

  }




const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    dispatch(updateStart());

    const res = await fetch(`/api/user/update/${currentuser._id}`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(formData)
    })

    const data = await res.json();
    if(data.success === false){
      dispatch(updateFailure(data.message));
      return;
    }

    dispatch(updateSuccess(data));

    if(data.success === false){
      dispatch(updateFailure(data.message));
      return ;
    }

     dispatch(updateSuccess(data));
     setUpdSuccess(true);
     alert("User updated successfully !")
   
  } catch (error) {
    dispatch(updateFailure(error.message));
  }


} 

  const handleChange = (e) => {
      setFormData({...formData,[e.target.id]:e.target.value});
      setPassword(e.target.value);
  };


  const handleDelete = async () => {

    try {
      dispatch(deleteStart());

      const res = await fetch(`/api/user/delete/${currentuser._id}`,{
        method:"DELETE"
      })

      const data = await res.json();

      if(data.success === false){
        dispatch(deleteFailure(data.message));
        return;
      }

      dispatch(deleteSuccess(data));
    
    } catch (error) {
      next(dispatch(deleteFailure(error.message)))
    }
  }

  const handleOut = async () => {
    try {
      dispatch(outStart());
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();
      if(data.success === false){
        dispatch(outFailure(data.message));
        return;
      }
      dispatch(outSuccess(data));

    } catch (error) {
      dispatch(outFailure(error.message));
    }
  }
  

  return (
    
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl font-semibold text-center my-7 font-mono italic">Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        <input 
          onChange={(e) => setFile(e.target.files[0])}
          type="file"  
          ref={fileReference}
          accept='image/*'
          hidden
        />
        <img 
          onClick={() => fileReference.current.click()}
          alt='profile'
          className='rounded-full h-24 w-24 objectfit-cover self-center cursor-pointer ' 
          src={formData.avatar || currentuser.avatar}
          onChange={handleChange}
        />
        {
          fileerror ? 
          <span className='mx-auto text-red-600 font-bold'>Image must be within 2 mb</span>
          
          :
          (filepercent > 0 && filepercent < 100) ?
          <span className='mx-auto text-yellow-600 font-bold'>{`file is uploaded ${filepercent} %`}</span>
          :
          filepercent === 100 ?
          <span className='mx-auto text-green-600 font-bold'>file uploaded successfully !!</span>
          :
          ""
        }
        <input 
          type="text" 
          placeholder='username' 
          defaultValue={currentuser.username}
          id='username'
          className='border p-3 rounded-lg text-green-600 font-semibold'
          onChange={handleChange}
        />
        
        <input 
          type="text" 
          placeholder='email' 
          defaultValue={currentuser.email}
          id='email'
          className='border p-3 rounded-lg text-green-600 font-semibold'
          onChange={handleChange}
        />
        
          <div className=" flex justify-between border items-center  rounded-lg text-green-600 font-semibold w-300px bg-gray-50 ">

          <input 
            type={visible ? 'text' : 'password'}
            placeholder='passwrod' 
            defaultValue={currentuser.password}
            id='password'
            value={password}
            onChange={handleChange}
            className='focus:outline-none p-3 rounded-lg text-green-600 font-semibold w-full'
          />
          <div className='p-4 bg-[#FFFFFF]' onClick={() => setVisible(!visible)}>
              {
                visible ? <BsEye/> : <BsEyeSlash />
              }
          </div>
        
          </div>
        <button 

          onClick={handleSubmit}
          disabled={loading}
          className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          {
            loading ? "updating ... " :"update"
          }
        </button>
        <Link className='bg-emerald-500 hover:bg-green-400  text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-center' to={"/create-listing"}>
           Create Listing
        </Link>
        <Link className='bg-emerald-500 hover:bg-green-400  text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-center ' to={"/show-listing"}>
           Show Listings
        </Link>
      </form>
      <div className='flex justify-between mt-4'>
        <span onClick={handleDelete} className='hover-pointer text-yellow-600 font-semibold cursor:pinter'>Delete Accout</span>
        <span onClick={handleOut} className=' hover-pointer text-yellow-600 font-semibold cursor:pinter'>Sign Out</span>
      </div>
      
      <p className='text-green-700 mt-5 font-semibold'>{updSuccess ? "user updated successfully" : ""}</p>
      
    </div>
  )
}

export default Profile