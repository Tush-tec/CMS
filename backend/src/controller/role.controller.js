import { isValidObjectId } from "mongoose";
import { Role } from "../models/role.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";



const addrole = asyncHandler(async (req, res) => {

    const {name} = req.body

    if(!name ) {
        throw new ApiError(
            401,
            "Please fill the details,"
        )
    }

    const checkExistRole = await Role.findOne({name})

    if(checkExistRole){
        throw new ApiError(
            401,
            "Role is already Exist"
        )
    }

    const role = await Role.create(
        {
            name,
            
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            role,
            "Role Added Successfully."
        )
    ) 
})


const assignRole = asyncHandler(async(req,res) => {

    const {userId, roleId} = req.body


    if (!userId || !roleId) {
        throw new ApiError(400, "User ID and Role ID are required");
    }
    
    if (!isValidObjectId(userId) || !isValidObjectId(roleId)) {
        throw new ApiError(401, "One or both IDs are invalid");
    }

    const findRole =  await Role.findById(roleId)

    if(!findRole){
        throw new ApiError(
            404,
            "Role not found"
        )
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            role : findRole._id,

        },
        {
            new : true
        }
    ).populate("role")


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
        user,
        "Role is successfully assign."
        )
    )
})

const getRole = asyncHandler(async(req,res) => {

    const role = await Role.find()

    if(!role || role.length === 0) {
        throw new ApiError(
            404,
            "Role is not found"
        )
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            200,
        role,
        "Role is successfully fetched."
        )
    )
})


const updateRole = asyncHandler(async (req, res) => {
    
    const {roleId} =  req.params
    const { name, permission } = req.body

    if(!isValidObjectId(roleId)){
        throw new ApiError(
            401,
            "Role is not valid"
        )
    }

    const update = await Role.findByIdAndUpdate(
        roleId,
        {
            name,  permission : permission
        },
    )

    if (!update) {
        throw new ApiError(404, "Role not found");
    }
    return res.status(200).json(
        new ApiResponse(200, update, "Role updated successfully.")
    )
})

const deleteRole = asyncHandler(async (req,res) =>{

    const {roleId} = req.params

    if(!isValidObjectId(roleId)) {
         throw new ApiError(
            401,
            "Ensure role are valid."
        )
    }

    const findRole = await Role.findById(roleId)

    if(!findRole){
        throw new ApiError(
            404,
            "Role is Not Found"
        )
    }


    const role = await Role.findByIdAndDelete(
        roleId
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Role is successfully deleted"
        )
    );
    
})

export { 
    addrole,
    assignRole,
    getRole,
    updateRole,
    deleteRole
}

