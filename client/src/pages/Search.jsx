import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import HashLoader from "react-spinners/HashLoader";
import ListingItem from '../componentes/ListingItem.jsx';
const Search = () => {
    const [sidebardata,setSidebardata] = useState({
        searchTerm:'',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'created_at',
        order:'desc'
    });

    const [showMore,setshowMore] = useState(false)
    const [loading,setLoading] = useState(false);
    const [listings,setListings] = useState([])
    const navigate = useNavigate();
    console.log(listings);
    console.log(sidebardata);
    useEffect(()=>{

        setLoading(true);
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const orderFromUrl = urlParams.get('order');
        const sortFromUrl = urlParams.get('sort');

        if(searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || orderFromUrl || sortFromUrl){
            setSidebardata({
                searchTerm:searchTermFromUrl || '',
                type:typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false ,
                furnished:  furnishedFromUrl === 'true'? true : false ,
                offer: offerFromUrl === 'true' ? true : false,
                order:orderFromUrl || 'desc',
                sort:sortFromUrl || 'created_at',
            });
        }
        setTimeout(() => {
            const fetchListings = async () => {
                setshowMore(false);
                    const searchQuery = urlParams.toString();
                    const res = await fetch(`/api/listing/get?${searchQuery}`);
                    const data = await res.json();
                    if(data.length > 8){
                        setshowMore(true);
                    }else{
                        setshowMore(false);
                    }
                    setListings(data);
                    setLoading(false);
            };
    
            fetchListings();
        },1500)

    },[location.search]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();

        
            urlParams.set('searchTerm',sidebardata.searchTerm);
            urlParams.set('type',sidebardata.type);
            urlParams.set('parking',sidebardata.parking); 
            urlParams.set('furnished',sidebardata.furnished);      
            urlParams.set('offer',sidebardata.offer);      
            urlParams.set('order',sidebardata.order);
            urlParams.set('sort',sidebardata.sort);
        

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    const handleChange = (e) => {

        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'){
            setSidebardata({...sidebardata,type:e.target.id})
        }

        if(e.target.id === 'searchTerm'){
            setSidebardata({...sidebardata,searchTerm:e.target.value});
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setSidebardata({...sidebardata,[e.target.id]:e.target.checked || e.target.checked === 'true' ? true : false})
        }

        if(e.target.id === 'sort_order'){
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebardata({...sidebardata,sort,order});
        }
        
    }
    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex',startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`)
        const data = await res.json();
        console.log(data);
        if(listings.length < 9){
            setshowMore(false);
        }
        setListings([...listings,...data]);
    }

  return (
    <div className='flex flex-col md:flex-row'>
        <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen ">
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className="flex items-center gap-2">
                    <label className='whitespace-nowrap font-bold'>Search Term:</label>
                    <input type="text" 
                     id='searchTerm'
                     placeholder='Search'
                     className='border rounded-lg p-3 w-full'
                     value={sidebardata.searchTerm}
                     onChange={handleChange}
                    />
                </div>
                <div className="flex gap-4 flex-wrap">
                    <label className='font-bold '>Type:</label>
                    <div className="flex gap-2 ">
                        <input type="checkbox" 
                        id='all'
                        className='w-5'
                        onChange={handleChange}
                        checked={sidebardata.type === 'all'}
                        />
                        <span className='font-semibold italic'>Rent & Sale</span>
                    </div>
                    <div className="flex gap-2 ">
                        <input type="checkbox" 
                        id='rent'
                        className='w-5'
                        onChange={handleChange}
                        checked = {sidebardata.type === 'rent'}
                        />
                        <span className='font-semibold italic'>Rent</span>
                    </div>
                    <div className="flex gap-2 ">
                        <input type="checkbox" 
                        id='sale'
                        className='w-5'
                        onChange={handleChange}
                        checked = {sidebardata.type === 'sale'}
                        />
                        <span className='font-semibold italic'>Sale</span>
                    </div>
                    <div className="flex gap-2 ">
                        <input type="checkbox" 
                        id='offer'
                        className='w-5'
                        onChange={handleChange}
                        checked = {sidebardata.offer}
                        />
                        <span className='font-semibold italic'>Offer</span>
                    </div>
                </div>
                <div className="flex gap-4 flex-wrap">
                    <label className='font-bold '>Aminities:</label>
                    <div className="flex gap-2 ">
                        <input type="checkbox" 
                        id='parking'
                        className='w-5'
                        onChange={handleChange}
                        checked={sidebardata.parking}
                        />
                        <span className='font-semibold italic'>Parking</span>
                    </div>
                    <div className="flex gap-2 ">
                        <input type="checkbox" 
                        id='furnished'
                        className='w-5'
                        onChange={handleChange}
                        checked={sidebardata.furnished}
                        />
                        <span className='font-semibold italic'>Furnished</span>
                    </div>              
                </div>
                <div className='flex items-center gap-2'>
                    <label className='font-bold'>Sort:</label>
                    <select id="sort_order"
                     className='border rounded-lg p-3 font-semibold'
                     onChange={handleChange}
                     defaultValue={'created_at_desc'}
                    >
                        <option value='regularPrice_desc'>Price High to Low</option>
                        <option value='regularPrice_asc'>Price Low to High</option>
                        <option value='createdAt_desc'>Latest</option>
                        <option value='createdAt_asc'>Oldest</option>
                    </select>
                </div>
                <button className='bg-teal-400 hover:bg-teal-500 text-white font-semibold py-2 px-4 border border-black-600 rounded shadow-md transition duration-300 ease-in-out mt-7 uppercase'>Search</button>
            </form>
        </div>
        
        <div className='flex-1'>
            {
                !loading && (
                    <h1 className="text-2xl font-semibol border-r-3 shadow-sm tracking-tighter text-slate-700 p-5 font-bold italic">Listings Results :</h1>
                )
            }
            <div className='p-5 flex flex-row flex-wrap gap-3'>
             {
                loading && (
                    <div className="w-full items-center flex h-screen justify-center"> 
                        <HashLoader
                        color={"#5EEAD4"}
                        loading={loading}
                        size={75}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        />
                    </div>  
                )
             }
             {!loading && listings.length === 0 &&(
                <p className='font-bold text-lg'>No lisitng Found</p>
              )
             }
             {
                !loading && listings.length > 0 && listings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing}/>
                ))
             }
             { showMore && (
                <button
                 onClick={onShowMoreClick}
                 className='text-green-700 hover:underline p-5 text-center w-full '
                >
                    Show More
                </button>
             )}
            </div>
        </div>
    </div>
  )
}

export default Search
