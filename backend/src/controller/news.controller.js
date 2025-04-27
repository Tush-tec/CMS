import { News } from "../models/news.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";




const createNews = asyncHandler(async(req, res) => {


    const {title, content, category} = req.body

    if(!title || content || !category){
        throw  new ApiError(
            401,
            "Please fill all details."
        )
    }


    const imageLocalPath = req.files?.image?.[0].path

    if(!imageLocalPath){
        throw new ApiError(
            400,
            "Failed to upload image"
        )
    }

    const image =  await uploadOnCloudinary(imageLocalPath)


    const  news = await News.create(
        {
            title,
            content,
            category,
            image : image.url
        }
    )


    return res
    .status(200)
    .json(
         new ApiResponse(
            200,
            news,
            "News is created successfully!"
        )
    )
})



const getNews = asyncHandler(async(req, res) => {

    

})
export {
    createNews,
    getNews
}