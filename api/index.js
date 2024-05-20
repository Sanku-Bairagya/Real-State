import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import listingRouter from "./routes/listing.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import bodyParser from "body-parser"
import crypto from "crypto"
import nodemailer from "nodemailer"
import bcryptjs from "bcryptjs"
import User from "./models/user.model.js"
import path from "path"

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());


( async() => {
    try{
        await  mongoose.connect(process.env.MONGODB_URI)
        
        app.listen(3000,()=>{
            console.log("MongoDB connected !! 🗿");
        })
        

    }catch(error){
        console.log("Database connection error ! ",error)
        throw error;
    }
})()

const __dirname = path.resolve();

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);

app.use(express.static(path.join(__dirname,'/client/dist')));

app.get('*',(req,res) => {
  res.sendFile(path.join(__dirname,'client','dist','index.html'))
})

const otpStore = {};


// Configuring nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.MY_EMAIL, 
      pass: process.env.MY_PASS,  
    },
  });
  



app.post('/api/send-otp',(req,res) => {
    const {email} = req.body;

    if(!email){
        return res.status(400).json({success:false,message:'Email is required'})
    }

    //generating a random 6 digit code
    const otpp = crypto.randomInt(100000,999999).toString();

    //store OTP with a timestamp of 10 minutes
    otpStore[email] = {otpp, timeStamp:Date.now()};

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_ID,  // replace with your email
      to: email,
      subject: 'Your OTP Code',
      text:`Your OTP code is ${otpp} from NestQuest. It is valid for 10 minutes.`
    };

    transporter.sendMail(mailOptions, (error,info) => {
        if(error) {
            console.log(error);
            return res.status(400).json({success:false,message:'Failed to send the mail'})
        }
        else{
            console.log('Email sent '+ info.response);
            return res.status(200).json({success:true,message:'OTP sent successfully !'})
        }
    })

})

app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
  
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }
    const storedOtpDetails = otpStore[email];
  
    if (!storedOtpDetails) {
      return res.status(400).json({ success: false, message: 'Invalid email or OTP' });
    }
  
    const { otpp: storedOtp, timeStamp } = storedOtpDetails;
    
    // Check if OTP is valid 

    if (otp === storedOtp && (Date.now() - timeStamp) < 10 * 60 * 1000) { // 1 minutes of OTP validations
      delete otpStore[email];  // Remove OTP after successful verification

      return res.status(200).json({ success: true, message: 'OTP verified successfully' });

    } else {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
  });


 app.post('/api/reset-password', async (req,res)=>{

  const {email,password} = req.body;
  
  if(!email || !password){
    return res.status(400).json({success:false,message:"Email and new password is required"});
  }

  try {
    const hashedPassword = bcryptjs.hashSync(password,10);
    const user = await User.findOneAndUpdate({email},{password:hashedPassword});
    if(!user) {
      return res.status(400).json({success:false,message:"User Not found"});

    }
    return res.status(200).json({success:true,message:"Passord Reset successfully ! "});

  } catch (error) {

    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
   

 }
   

 )






//middleware for handling the custom error 

app.use((err,req,res,next) => {
    
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error"

    return res.status(statusCode).json({
        success:false,
        statusCode, 
        message
    })

})





