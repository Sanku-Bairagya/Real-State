import  { useState } from "react"
import {Link ,useNavigate} from "react-router-dom"
import{useDispatch,useSelector} from "react-redux"
import { signInFailure,signInSuccess,signInStart } from "../redux/user/userSlice.js"
import Oauth from "../componentes/Oauth.jsx"
import {BsEyeSlash,BsEye} from 'react-icons/bs'

const SignIn = () => {
    const [formdata,setFormdata] = useState({});
    const { loading , error } = useSelector((state) => state.user);
    const [password,setPassword] = useState("");
    const [visible,setVisible] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    

    const handleChange = (e) => {
       
        setFormdata({
            ...formdata,
            [e.target.id]:e.target.value
        });
        

    }
    

    const handleChangePass = (e) => {
        setFormdata({...formdata,[e.target.id]:e.target.value});
        setPassword(e.target.value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try{
            dispatch(signInStart());
            const res = await fetch('/api/auth/signin',
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(formdata),
            });
            const data = await res.json();
            if(data.success === false){
                //if error occurs in the data then dispatch the events to the store
                dispatch(signInFailure(data.message));
                return;
            }
            dispatch(signInSuccess(data));
            navigate('/');

        }catch(error){
            //if error to fetching the backend occurs then dispatch the events to the store
            dispatch(signInFailure(error.message));
        }
    }

    return (
    
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Sign In</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                <input 
                    type="email" 
                    placeholder='email'
                    className='border p-3 rounded-lg' 
                    id="email"
                    onChange={handleChange}
                />
                <div className=" flex justify-between border items-center rounded-lg text-green-600 font-semibold w-300px bg-gray-50 ">

                <input 
                type={visible ? 'text' : 'password'}
                placeholder='passwrod' 
                
                id='password'
                value={password}
                onChange={handleChangePass}
                className='focus:outline-none p-3 rounded-lg text-green-600 font-semibold w-full'
                />
                <div className='p-4 bg-[#FFFFFF]' onClick={() => setVisible(!visible)}>
                    {
                    visible ? <BsEye/> : <BsEyeSlash />
                    }
                </div>

                </div>
                <Link to={"/forgotpassword"}>
                    <span className="text-blue-600">Forgot Password ? ...</span>
                </Link>
               
                <button disabled={loading} className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 uppercase"
                >
                    {loading ? 'loading ...' : 'Sign in'}
                </button>
                <Oauth/>
            </form>
            
            <div className="flex gap-2 mt-3">
                <p>Don't have an account 😒?</p>
                <Link to={"/sign-up"}>
                    <span className="text-blue-600">Sign Up</span>
                </Link>
            </div>
            {error && <div className='mt-5 text-white bg-gradient-to-r from-red-400 via-yellow-300 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 uppercase"'>
            <p className='text-red-500 mt-5'>Error : {error}</p></div>}
            
            
        </div>
    );
}
export default SignIn