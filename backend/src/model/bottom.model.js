import mongoose from "mongoose";

const bottomClothesSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        imageUrl:{
            type: String,
            required: true,
        },
        embedding:{
            type: [Number],
            required: true,
        }
    }
)

export const BottomClothes = mongoose.model("BottomClothes", bottomClothesSchema);
