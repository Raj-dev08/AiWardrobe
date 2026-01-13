import Wardrobe from "../model/wardrobe.model.js";
import User from "../model/user.model.js";
import { TopClothes } from "../model/top.model.js";
import { BottomClothes } from "../model/bottom.model.js";
import { Shoes } from "../model/shoes.model.js";
import { Accessories } from "../model/accessories.model.js";

import { embeddingsQueue } from "../lib/embeddings.queue.js";


export const createWardrobe = async (req, res, next) => {
    try {
        const { user } = req;
        
        const topClothes = await TopClothes.create({ userId: user._id, tops: [] });
        const bottomClothes = await BottomClothes.create({ userId: user._id, bottoms: [] });
        const shoes = await Shoes.create({ userId: user._id, shoes: [] });
        const accessories = await Accessories.create({ userId: user._id, accessoriesSchema: [] });
        
        const wardrobe = await Wardrobe.create({
            userId: user._id,
            top: topClothes._id,
            bottom: bottomClothes._id,
            shoes: shoes._id,
            accessories: accessories._id
        });

        await User.findByIdAndUpdate(user._id, { wardrobe: wardrobe._id });
        res.status(201).json({ wardrobe });
    } catch (error) {
        next(error)
    }
}

export const getMyWardrobe = async (req, res, next) => {
    try {
        const { user } = req;

        const wardrobe = await Wardrobe.findOne({ userId: user._id })
            .populate("top")
            .populate("bottom")
            .populate("shoes")
            .populate("accessories");

        res.status(200).json({ wardrobe });
    } catch (error) {
        next(error)
    }
}

export const addClothingItem = async (req, res, next) => {
    try {
        const { user } = req;
        const { category, image } = req.body;

        if(!user.wardrobe){
            return res.status(400).json({ message: 'Wardrobe does not exist' })
        }

        const wardrobe = await Wardrobe.findById(user.wardrobe);

        if(!wardrobe){
            return res.status(400).json({ message: 'Wardrobe not found' })
        }

        if(!image){
            return res.status(400).json({ message: 'Image is required' })
        }

        if(!['Top', 'Bottom', 'Shoes', 'Accessories'].includes(category)){
            return res.status(400).json({ message: 'Invalid category' })
        }

        await embeddingsQueue.add(`processEmbeddingsFor${category}`, { 
            userId: user._id,
            image
        })


        return res.status(200).json({ message: 'Clothing item is being processed' })
    } catch (error) {
        next(error)
    }
}

export const removeClothingItem = async (req, res, next) => {
    try {
        const { user } = req;
        const { clothId } = req.params;
        const { category } = req.body;
        
        if(!user.wardrobe){
            return res.status(400).json({ message: 'Wardrobe does not exist' })
        }

        if(!['Top', 'Bottom', 'Shoes', 'Accessories'].includes(category)){
            return res.status(400).json({ message: 'Invalid category' })
        }

        if(category === 'Top'){
            await TopClothes.findOneAndUpdate(
                { userId: user._id },
                { $pull: { tops: { _id: clothId } } }
            );
        }
        if(category === 'Bottom'){
            await BottomClothes.findOneAndUpdate(
                { userId: user._id },
                { $pull: { bottoms: { _id: clothId } } }
            );
        }
        if(category === 'Shoes'){
            await Shoes.findOneAndUpdate(
                { userId: user._id },
                { $pull: { shoes: { _id: clothId } } }
            );
        }
        if(category === 'Accessories'){
            await Accessories.findOneAndUpdate(
                { userId: user._id },
                { $pull: { accessories: { _id: clothId } } }
            );
        }

        return res.status(200).json({ message: 'Clothing item removed successfully' })
    } catch (error) {
        next(error)
    }
}