import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError"
import { User } from "../models/user.model"




export const checkAuth = async (req, res, next ) => {

    try {
        const token = req.cookies.accessToken ||  req.header("Authorization")?.replace("Beareer ", " ")
    
    
        if(!token){
            throw new ApiError(404, 
                "Acess Token is missing"
            )
        }
    
        const decode = await jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        )
    
        const user = await User.findById(decode._id).select("-password -refreshToken")
        
        if (!user) {
            throw new ApiError(401, "User not found. Token might be invalid or expired.");
        }
    
        req.user = user
    
        next()
    
    } catch (error) {

        console.log(error);

        throw new ApiError(
            401, error?.message || "Authentication failed"
        )
        
        
    }
}


// export const checkAuthentication = async (req,res, next) =>{

//     if(req.user)
// }