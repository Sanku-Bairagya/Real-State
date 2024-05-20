import { errorHandler } from "./error.js";
import  jwt from "jsonwebtoken";
export const verifyToken = async (req,res,next) => {

    const token = await req.cookies.access_token;

    if(!token) return next(errorHandler(401,"Unauthorized"));

    jwt.verify(token, process.env.JWT_SECRET_KEY,(err,user) => {

        if(err) return next(errorHandler(403,"Forbidden User"));

        req.user = user;
        next();
    });

}