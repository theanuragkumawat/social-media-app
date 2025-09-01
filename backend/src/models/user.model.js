import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String
        },
        bio:{
            type:String
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        followersCount:{
            type: Number
        },
        followingCount:{
            type: Number
        },
        isPrivate:{
            type:Boolean,
            default:false
        },
        isBlocked:{
            type:Boolean,
            default:false
        },
        isDisabled:{
            type:Boolean,
            default:false
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        refreshToken:{
            type:String
        }
    },
    { timestamps: true }
)

export const User = mongoose.model('User', userSchema)