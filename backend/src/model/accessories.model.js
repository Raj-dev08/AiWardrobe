import mongoose from "mongoose";

const accessoriesSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        accessories: [
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

export const Accessories = mongoose.model("Accessories", accessoriesSchema);