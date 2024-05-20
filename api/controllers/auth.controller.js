import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

//for sign up details
export const signUP = async (req,res,next) => {
    const {username,email,password} = req.body;
    const hashedpass = bcryptjs.hashSync(password,10);
    const newUser = new User({username,email,password:hashedpass});

    
    try{
        await newUser.save();
        res.status(201).json("User created successfully");
        
    }catch(error){
        next(errorHandler(500,error.message));
    }
};


//for sign-in details
export const signIn = async(req,res,next) => {
    const {email,password} = req.body;
    try {
        const validUser = await User.findOne({email});

        if(!validUser){
            return next(errorHandler(404,"User not found"));
        }

        const validPassword =  bcryptjs.compareSync(password,validUser.password);

        if(!validPassword){
            return next(errorHandler(401,"Wrong email or password  !"));
        }
        
        const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET_KEY,{ expiresIn: '300d' });
        const {password:pass,...restUser} = validUser._doc;
        res
            .cookie('access_token',token,{
               expires: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
               httpOnly:true
           })
            .status(200)
            .json(restUser)

    } catch (error) {
        next(error)
    }
}




//for google authentication
export const google = async(req,res,next) => {
    const {email} = req.body;
    try {
        
        const newUser = await User.findOne({email});
        
        if(newUser){
            //if user exists

            const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET_KEY);
            const {password,...rest} = newUser._doc;
            res
                .cookie('access_token',token,{httpOnly:true})
                .status(200)
                .json(rest)
        }
        else{

            //if user doesn't exists then the user will be created and save to database

            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            const hashedPassword = bcryptjs.hashSync(generatedPassword,10);

            const newUser = new User({

                username:req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),

                email:req.body.email,

                password:hashedPassword,

                avatar:req.body.photo
            });
            await newUser.save();
            
            const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET_KEY,{expiresIn: '300d'});

            const {password,...rest} = newUser._doc;
            res
                .cookie('access_token',token,{
                    expires: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
                    httpOnly:true
                })
                .status(200)
                .json(rest);

        }

    } catch (error) {
        next(error)
    }

}

// sign out functionality

export const signOut = async (req,res,next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json("User has been logged out")
    } catch (error) {
        next(error)
    }
};




