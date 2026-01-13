import mongoose from "mongoose";

const topClothesSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tops: [
            {
                imageUrl:{
                    type: String,
                    required: true,
                },
                embedding:{
                    type: [Number],
                    required: true,
                }
            }
        ]
    }
)

export const TopClothes = mongoose.model("TopClothes", topClothesSchema);
