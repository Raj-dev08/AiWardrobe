import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
            minlength:4
        },
        expoPushToken:{
            type:String,
        },
        previewModel:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "PreviewModel",
        },
        wardrobe:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Wardrobe",
        }
    }
)

const User = mongoose.model("User",userSchema)

export default User;