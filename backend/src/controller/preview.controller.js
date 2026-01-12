import previewModel from "../model/preview.model.js";
import User from "../model/user.model.js";

export const createModel = async (req,res,next) => {
    try {
        const { user } = req
        const { weight, height, age, gender, skinColor } = req.body

        if(user.previewModel){
            return res.status(400).json({ message: 'Preview model already exists' })
        }

        if (!weight || !height || !age || !gender || !skinColor) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        if( age < 1 || age > 200){
            return res.status(400).json({ message: 'Age must be between 1 and 200' })
        }

        if( height < 1 || height > 400){
            return res.status(400).json({ message: 'Height must be between 1cm and 400cm' })
        }

        if( weight < 1 || weight > 400){
            return res.status(400).json({ message: 'Weight must be between 1kg and 400kg' })
        }

        if(!['male', 'female', 'other'].includes(gender)){
            return res.status(400).json({ message: 'Gender must be male, female or other' })
        }

        const newModel = new previewModel({
            userId: user._id,
            weight,
            height,
            age,
            gender,
            skinColor,
        })

        const savedModel = await newModel.save()

        await User.findByIdAndUpdate(user._id, { previewModel: savedModel._id })


        return res.status(201).json({ savedModel })
    } catch (error) {
        next(error);
    }
}

export const customizeModel = async (req,res,next) => {
    try {
        const { user } = req
        const { chest, waist, hips, height, weight, age, gender, skinColor} = req.body

        if(!user.previewModel){
            return res.status(400).json({ message: 'Preview model does not exist' })
        
        }

        const userModel = await previewModel.findById(user.previewModel)

        if(!userModel){
            return res.status(400).json({ message: 'User model not found' })
        }

        if(chest !== undefined){
            if( chest > 1 && chest < 400){
                userModel.measurement.chest = chest
            }
        }

        if(waist !== undefined){
            if( waist > 1 && waist < 400){
                userModel.measurement.waist = waist
            }
        }

        if(hips !== undefined){
            if( hips > 1 && hips < 400){
                userModel.measurement.hips = hips
            }
        }

        if(height !== undefined){
            if( height > 1 && height < 400){
                userModel.height = height
            }
        }
        if(weight !== undefined){
            if( weight > 1 && weight < 400){
                userModel.weight = weight
            }
        }
        if(age !== undefined){
            if( age > 1 && age < 200){
                userModel.age = age
            }
        }
        if(gender){
            if(['male', 'female', 'other'].includes(gender)){
                userModel.gender = gender
            }
        }
        if(skinColor){
            userModel.skinColor = skinColor
        }

        const savedModel = await userModel.save()

        return res.status(200).json({ savedModel })
    } catch (error) {
        next(error)
    }
}