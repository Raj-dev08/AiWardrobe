import axios from "axios";
import previewModel from "../model/preview.model.js";
import { TopClothes } from "../model/top.model.js";
import { BottomClothes } from "../model/bottom.model.js";
import { Shoes } from "../model/shoes.model.js";
// import { Accessories } from "../model/accessories.model.js";


const embeddingsWorkerLink =
  process.env.EMBEDDINGS_WORKER_LINK? 
  `${process.env.EMBEDDINGS_WORKER_LINK}/embed-text`: 
  "http://127.0.0.1:1000/embed-text";

const embedTextAndSearch = async (model, indexName, text, userId , limit = 2) => {

    const { data } = await axios.post(embeddingsWorkerLink, {
        text,
    });

    const embedding = data.embedding;

    const results = await model.aggregate([
        {
            $vectorSearch: {
                index: indexName,
                path: "embedding",
                queryVector: embedding,
                numCandidates: 200,
                limit:50
            }
        },
        {
            $match: { userId }
        },
        {
            $limit: limit
        }
    ])
    

    return results;
};

export const getSuggestions = async (req, res, next) => {
    try {
        const { user } = req;

        const { eventDescription } = req.body;

        if(!eventDescription){
            return res.status(400).json({ message: 'Event description is required' });
        }

        if (!user.previewModel) {
            return res.status(400).json({ message: 'User does not have a preview model set up' });
        }  

        const model = await previewModel.findById(user.previewModel);

        if(!model){
            return res.status(404).json({ message: 'Please make the preview model first' });
        }

        const systemPrompt = `You are a fashion expert AI assistant that provides outfit
                            suggestions based on user given event description.
                            Suggest what kind of clothes (top, bottom, shoes, accessories)
                            the user should wear for the event.
                            Respond in JSON format as shown in the example:
                            {
                                "top": "type of top clothing",
                                "bottom": "type of bottom clothing",
                                "shoes": "type of shoes",
                                "accessories": "type of accessories"
                            }
                            Provide the type of clothing so that i can embed it 
                            and find similar clothes from user's wardrobe.
                            The user has the following model attributes:
                            Height: ${model.height} cm
                            Weight: ${model.weight} kg
                            Age: ${model.age} years
                            Gender: ${model.gender}
                            Skin color: ${model.skinColor}
                            Use this information to provide better suggestions.
                            ${model.measurement? `User measurements are:
                                Chest: ${model.measurement.chest} cm
                                Waist: ${model.measurement.waist} cm
                                Hips: ${model.measurement.hips} cm
                                ` : ''}
                            Here is an example event description and response:
                            event description: "A summer beach party"
                            response: {
                                "top": "white lightweight tank top",
                                "bottom": "black casual shorts",
                                "shoes": "flip flops",
                                "accessories": "colorful sunglasses and a sun hat and a silver chain necklace"
                            }
                            Provide concise responses without any additional explanations.
                            Always respond in JSON format only.
                            It is not always mandotory to provide suggestions for all four categories.
                            Suggest only the necessary clothing items based on the event description.
                            If the event is just casual that does not need accessories, then skip that.
                            But make sure to suggest at least one clothing item so User is not Naked.
                            If user wants to wear specific type of clothing, then suggest that.
                            But always follow the JSON format while giving cloth suggestions.
                            ADITIONAL NOTE : For now there are no accessories in wardrobe,
                            so just suggest accessories as text in the response it wont be embedded or searched from wardrobe.
                            `;


        const { data } = await axios.post(
            `${process.env.HF_URL}/chat/completions`,
            {
            model: "Qwen/Qwen2.5-7B-Instruct",
            messages: [
                {
                role: "system",
                content: systemPrompt,
                },
                {
                role: "user",
                content: eventDescription,
                },
            ],
            },
            {
            headers: {
                Authorization: `Bearer ${process.env.HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            }
        );

        const responseMessage = data.choices[0].message.content;

        if(!responseMessage.startsWith("{")){
            return res.status(200).json({ suggestion: responseMessage });
        }
        const pureText = responseMessage.slice(responseMessage.indexOf('{'), responseMessage.lastIndexOf('}') + 1);
        const jsonResponse = JSON.parse(pureText);

        let payload = {};
        if ( jsonResponse.top ) {
            const topResults = await embedTextAndSearch(TopClothes, "top_embedding_index", jsonResponse.top, user._id);//BAD PRACTICE: use same naming convention for indexes and use env variables if u want to, I skipped env as too much work for now
            payload.top = topResults;
        }

        if ( jsonResponse.bottom ) {
            const bottomResults = await embedTextAndSearch(BottomClothes, "bottom-embedding-index", jsonResponse.bottom, user._id);
            payload.bottom = bottomResults;
        }

        if ( jsonResponse.shoes ) {
            const shoesResults = await embedTextAndSearch(Shoes, "shoes-embedding-index", jsonResponse.shoes, user._id);
            payload.shoes = shoesResults;
        }

        if ( jsonResponse.accessories ) {
            payload.accessories = jsonResponse.accessories;
        }   

        return res.status(200).json({ suggestion: payload });
    } catch (error) {
        console.error("Error in getSuggestions:", error);
        next(error);
    }
}
