import { Role } from "../models/role.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asynchandler";



const addrole = asyncHandler(async (req, res) => {

    const {name, permission} = req.body

    if(!name ) {
        throw new ApiError(
            401,
            "Please fill the details,"
        )
    }

    const checkExistRole = await Role.findOne(name)

    if(checkExistRole){
        throw new ApiError(
            401,
            "Role is already Exist"
        )
    }

    const role = await Role.create(
        {
            name
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



export { 
    addrole
}

