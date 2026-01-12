import mongoose from "mongoose";

const previewModelSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        weight:{
            type: Number,
            required: true,
        },
        height:{
            type: Number,
            required: true,
        },
        age:{
            type: Number,
            required: true,
        },
        gender:{
            type: String,
            enum: ["male", "female", "other"],
            required: true,
        },
        skinColor:{
            type: String,
            required: true,
        },
        measurement:{
            chest:{
                type: Number,
                default: 90
            },
            waist:{
                type: Number,
                default: 80
            },
            hips:{
                type: Number,
                default: 85
            }
        }
    }
)

const previewModel = mongoose.model("PreviewModel", previewModelSchema);

export default previewModel;