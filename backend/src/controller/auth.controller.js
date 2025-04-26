import { Role } from "../models/role.model.js";
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";


const generateAccessAndRefreshTokens = async (userId) => {
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        throw new ApiError(404, "User not found");
      }
  
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
  
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      console.error(error.message || error )
     
    }
  };


const register = asyncHandler(async (req, res) => {
    const { username, email, fullname ,password, role } = req.body;
  
    if (!username || !email || !fullname || !password) {
      throw new ApiError(400, "Please fill all fields");
    }
    
  
   
    
  
  
    const existUser = await User.findOne(

        {
            $or :[
                {
                    username
                },
                {
                    email
                }
            ]
        }
    );
  
    
    if (existUser) {
      throw new ApiError(400, "Username already exists");
    }
  
  
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }
  
  
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      throw new ApiError(400, "Failed to upload avatar");
    }
  

  
      const createUser = await User.create({
        username,
        email,
        fullname,
        password,
        avatar: avatar.url,
        role 
      });
  
  
      const checkUserCreatedorNot = await User.findById(createUser._id).select(
        "-password -refreshToken"
      );
  
      if (!checkUserCreatedorNot) {
        throw new ApiError(500, "Something went wrong during registration");
      }
  
      return res.status(201).json(
        new ApiResponse(201, checkUserCreatedorNot, "User created successfully")
      );
  
  });


  const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new ApiError(400, "Username and Password are required");
    }

    const user = await User.findOne({ username });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isValidPassword = await user.isPasswordCorrect(password);

    if (!isValidPassword) {
      throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true, 
      sameSite: "None", 
      path: '/' 
  };
  

    return res
      .status(200)
      .cookie("accessToken", accessToken,  )
      .cookie("refreshToken", refreshToken, )
      .json(
        new ApiResponse(
          200,
          { loggedInUser, accessToken, refreshToken},
          "User logged in successfully"
        )
      );
  });




  const logOut = asyncHandler(async (req, res) => {

  
    await User.findByIdAndUpdate(
      req.user?._id,
  
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );
  
    const options = {
      httpOnly: true,
      secure: true,
    };
  
    return res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(new ApiResponse(200, {}, "User Logged-Out"));
  });


  const getIndividualUser = asyncHandler(async(req,res) =>{
    const { id } = req.params;  
    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
      return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          user, 
          "User found"
        )
      );
  })
  
  
  const getUser = asyncHandler(async (req, res) => {
    if (!req.user?._id) {
      throw new ApiError(400, "User ID is required");
    }
  
    const userData = await User.aggregate([
      {
        $match: { _id: req.user._id }, 
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "owner",
          as: "orders",
        },
      },
      {
        $lookup: {
          from: "products", 
          localField: "orders.cartItems.productId", 
          foreignField: "_id",
          as: "cartDetails",
        },
      },
      {
        $lookup: {
          from: "addresses",
          localField: "orders.address",
          foreignField: "_id",
          as: "addressDetails",
        },
      },
      {
        $addFields: {
          "orders.cartDetails": "$cartDetails",
          "orders.addressDetails": "$addressDetails",
        },
      },
      {
        $project: {
          password: 0,
          "orders.__v": 0,
          "orders.cartDetails.__v": 0,
          "orders.addressDetails.__v": 0,
        },
      },
    ]);
  
    if (!userData.length) {
      throw new ApiError(404, "User not found");
    }
  
  
    return res.status(200).json(
      new ApiResponse(200, { userData: userData[0] }, "User found successfully")
    );
  });
  

  export {
    register,
    login,
    logOut,
    getIndividualUser,
    getUser
  }



  