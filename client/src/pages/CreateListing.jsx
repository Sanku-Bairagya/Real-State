import { getDownloadURL, getStorage,ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../../firebase.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';



const CreateListing = () => {
  const {currentuser} = useSelector(state => state.user)
  const [files,setFiles] = useState([])
  const navigate = useNavigate()
  const [formData,setFormData] = useState({
    imageUrls:[],
    name:'',
    description:'',
    address:'',
    type:'rent',
    bedroom:1,
    bathroom:1,
    regularPrice:100,
    discountedPrice:0,
    parking:false,
    furnished:false,
    offer:false

  });

  const [imageuploadError,setImageuploadError] =  useState(null);
  const [uploading,setUploading] = useState(false)
  const [error,setError] = useState(false);
  const [loading,setLoading] = useState(false);
  
  
  console.log(formData);

  const handleImageUpload =  (e) => {

     if(files.length > 0 && files.length < 8) {
        setUploading(true);
        setImageuploadError(false);
        const promises = [];
        for(let i = 0 ;i<files.length;i++){
          promises.push(storeImage(files[i]));
        }
        Promise.all(promises).then((urls)=>{
          setFormData({...formData,imageUrls:formData.imageUrls.concat(urls)
          });
          setImageuploadError(false);
          setUploading(false);

        }).catch((error) => {
              setImageuploadError("You can upload maximum 7 image at a listing and size of each image will be 2KB");
              setUploading(false);
        })
      }else{
        setImageuploadError("You can upload 7 images in one listing")
        setUploading(false);
      }

  }
  
  const storeImage = async (file) => {
    return new Promise((resolve,reject)=> {
          const storage = getStorage(app);
          const fileName = new Date().getTime() + file.name;
          const storageRef = ref(storage,fileName);
          const uploadTask = uploadBytesResumable(storageRef,file);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(progress);
            },
            (error)=>{
              reject(error);
            },
            ()=>{
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                resolve(downloadURL);
              });
            }
          )
    })
  }
  
 const handleDeleteImage = (index) => {
  setFormData({
    ...formData,
    imageUrls: formData.imageUrls.filter((_,i) => i!== index ),
  })
 }

 const handleChange = (e) => {
    if(e.target.id === 'sale' || e.target.id === "rent"){
      setFormData({
        ...formData,
        type:e.target.id
      })
    }

    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setFormData({
        ...formData,
        [e.target.id]:e.target.checked
      })
    }

    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
      setFormData({
        ...formData,
        [e.target.id]:e.target.value
      })
    }
 }

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {

    if(formData.imageUrls.length < 1) {
      setError('You must upload atleast one image 😒!');
      setLoading(false);
      return ;
    } 

    if(+formData.regularPrice < +formData.discountedPrice) {
      setError('Discounted price must be less than regular price ! 😂');
      setLoading(false);
      return ;
    }

    const res = await fetch('/api/listing/create',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        ...formData,
        userRef:currentuser._id
      }),
    });
    const data = await res.json();
    setLoading(false);
    if(data.success === false){
        setError(data.message);
    }
    
    navigate(`/listUP/${data._id}`);
    
  } catch (error) {
    setError(error.message)
    setLoading(false);
  }
 }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-yellow-500 text-center my-7 italic'>Create Your Listing</h1>

      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-6'>

          <div className='flex flex-col gap-4 flex-1 '>

            <input type="text" onChange={handleChange} value={formData.name} placeholder='Name' className='border p-3 rounded-lg' id='name' minLength={5} maxLength={30} required/>
            
            <textarea type="text" onChange={handleChange} value={formData.description} placeholder='Description' className='border p-3 rounded-lg' id='description'  required/>

            <input type="text" onChange={handleChange} value={formData.address} placeholder='Address' className='border p-3 rounded-lg' id='address' required/>

            <div className='flex gap-6 flex-wrap'>
                <div className='flex gap-2'>
                    <input type="checkbox" id="sale" className='w-5' onChange={handleChange} checked={formData.type === 'sale'} />
                    <span>Sale</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id="rent" className='w-5' onChange={handleChange} checked={formData.type === 'rent'}/>
                    <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id="parking" className='w-5' onChange={handleChange} checked={formData.parking }/>
                    <span>Parking Spot</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id="furnished" className='w-5' onChange={handleChange} checked={formData.furnished } />
                    <span>Furnished</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id="offer" className='w-5' onChange={handleChange} checked={formData.offer }/>
                    <span>Offer</span>
                </div>
            </div>

            <div className='flex flex-wrap gap-6'>
              <div className='flex items-center gap-2'>
                <input type="number" id='bedroom' min='1' max='8' required 
                 className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bedroom } />
                 <p>Beds</p>
              </div>
              <div className='flex items-center gap-2'>
                <input type="number" id='bathroom' min='1' max='8' required 
                 className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bathroom } />
                 <p>Bathrooms</p>
              </div>
              <div className='flex items-center gap-2'>
                <input type="number" id='regularPrice' min='100' max='45000' required 
                 className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.regularPrice}/>
                 <div className='flex flex-col items-center'>
                    <p>Regular price</p>
                    {
                      formData.type===  "rent" && (<span className='text-xs'>($/month)</span>)
                    
                    }
                 </div>
              </div>
              {
                formData.offer && (
                  <div className='flex items-center gap-2'>
                  <input type="number" id='discountedPrice' min='0' max='65' required 
                   className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.discountedPrice } />
  
                   <div className='flex flex-col items-center'>
                      <p>Discounted price</p>
                      <span className='text-xs'>($)</span>
                   </div>
                </div>
                )
              }
              
            </div>

          </div>
          

          <div className='flex flex-col flex-1 gap-3'>
              <p className='font-semibold italic text-teal-700'>Images: 
                <span className='font-bold text-teal-500 italic'> The first Image will be the cover image (max 7 images)</span>
              </p>
              <div className='flex mt-5 gap-5'>
                  <input type="file" 
                    id="images" 
                    accept='image/*' 
                    multiple 
                    onChange={(e) => setFiles(e.target.files)}
                    maxLength="7"
                    className='bg-gray-200 border border-gray-300 rounded-lg p-2 shadow-md' 
                  />

                  <button 
                  className='bg-teal-500 hover:bg-teal-600 text-white font-semibold py-1 px-4 border border-teal-600 rounded shadow-md transition duration-300 ease-in-out uppercase'
                  onClick={handleImageUpload}
                  type='button'
                  disabled={uploading}
                  >

                    {uploading ? "Uploading ..." : "Upload"}
                  </button>
              </div>
              <p className='text-red-700 text-sm'>{imageuploadError}</p>
              <p className='text-green-700 text-md'>Uploaded Image(s) will be shown below when you will upload the listings!</p>
              {
                formData.imageUrls.length > 0 && formData.imageUrls.map((url,index)=>( 
                  <div key={url} className='flex bg-gray-100 justify-between p-1  border items-center rounded-lg border-teal border-4'>

                      <img src={url} alt="Listing Image" className='w-20 h-18 object-contain rounded-lg border-black border-1 '/>

                      <button type='button' 
                      onClick={()=>handleDeleteImage(index)}
                      className='bg-red-500 p-2 text-black font-bold rounded-lg border-black hover:bg-red-400'>Delete</button>
                                          
                  </div>          
                  
                ))
              }
              <button onClick={handleSubmit} type='button' disabled={loading || uploading} className='bg-teal-400 hover:bg-teal-500 text-white font-semibold py-2 px-4 border border-black-600 rounded shadow-md transition duration-300 ease-in-out mt-7 uppercase'>
                  {loading? "Creating ... " : "Create"}
              </button>
              {
                error && <p className='text-red-700 font-bold text-m mx-auto'>{error}</p>
                
              }
                    
          </div>
      </form>
      
    </main>
  )
}

export default CreateListing