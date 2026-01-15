import mongoose from "mongoose";

const wardrobeSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true 
        },
        top:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "TopClothes",
                required: true
            }
        ],
        bottom:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "BottomClothes",
                required: true
            }
        ],
        shoes:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Shoes",
                required: true
            }
        ],
        // accessories:{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Accessories",
        //     required: true
        // }
    
    }
)

const Wardrobe = mongoose.model("Wardrobe", wardrobeSchema);

export default Wardrobe;