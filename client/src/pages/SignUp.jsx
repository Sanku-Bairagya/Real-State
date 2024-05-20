import  { useState } from "react"
import {Link ,useNavigate} from "react-router-dom"
import Oauth from "../componentes/Oauth";


const SignUp = () => {
    const [formdata,setFormdata] = useState({})
    const [error,setError] =  useState(null);
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();


    const handleChange = (e) => {
        setFormdata({
            ...formdata,
            [e.target.id]:e.target.value
        })

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const res = await fetch('/api/auth/signup',
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(formdata),
            });
            const data = await res.json();
            if(data.success === false){
                setError(data.message);
                setLoading(false);
                return;
            }
            setLoading(false);
            setError(null);
            navigate('/sign-in');

        }catch(error){
            setLoading(false);
            setError(error.message);
        }
    }

    

    return (


        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Sign Up</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input 
                    type="text" 
                    placeholder='username'
                    className='border p-3 rounded-lg'
                    id="username"
                    onChange={handleChange}
                />
                <input 
                    type="email" 
                    placeholder='email'
                    className='border p-3 rounded-lg'
                    id="email"
                    onChange={handleChange}
                />
               
                <input 
                    type="password" 
                    placeholder='password'
                    className='border p-3 rounded-lg'
                    id="password"
                    onChange={handleChange}         
                />
                <button disabled={loading} className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 uppercase"
                >
                    {loading ? 'loading ...' : 'Sign Up'}
                </button>
                <Oauth/>
            </form>
            
            <div className="flex gap-2 mt-3">
                <p>Already have an account  😀?</p>
                <Link to={"/sign-in"}>
                    <span className="text-blue-600">sign in</span>
                </Link>
            </div>
            {error && <div className='mt-5 text-white bg-gradient-to-r from-red-400 via-yellow-300 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 uppercase"'>
            <p className='text-red-500 mt-5'>Error : {error}</p></div>}
            
            
        </div>
    );
}
export default SignUp