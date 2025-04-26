import mongoose, { mongo, Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"



const userSchema =  new Schema(
    {

        username:{
            type: String,
            index: true,
            trim: true,
            unique: true,
            lowercase: true

        },
        email:{
            type: String,
            lowercase:true,
            trim: true,
            required : true
        },
        fullname:{
            type:String,
            required: true,
            trim: true,
        },
        avatar:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true,
        },
        refreshToken:{
            type:String
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
        }
    },
    {
        timestamps: true
    }
)


userSchema.pre("save",async function (next) {

    if(!this.isModified("password")) return next

    if (!this.password) throw new Error("Password is undefined before hashing");
    this.password = await bcrypt.hash(this.password, 10);
    next();
})


userSchema.methods.isPasswordCorrect = async function(password) {
    if (!this.password) throw new Error("Password hash is missing");
    return await bcrypt.compare(password, this.password);

}



userSchema.methods.generateAccessToken =  function(){
    return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email,
            fullname:this.fullname,
            avatar: this.avatar,
            storedUserName:this.storedUserName,

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)