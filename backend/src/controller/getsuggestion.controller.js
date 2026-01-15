import axios from "axios";
import previewModel from "../model/preview.model.js";
import OpenAI from "openai";
import { TopClothes } from "../model/top.model.js";
import { BottomClothes } from "../model/bottom.model.js";
import { Shoes } from "../model/shoes.model.js";
// import { Accessories } from "../model/accessories.model.js";


const client = new OpenAI({
	baseURL: process.env.HF_URL,
	apiKey: process.env.HF_API_KEY,
});

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
                            Keep the user's gender in mind while suggesting outfits.
                            Provide trendy and fashionable suggestions.
                            Provide gender appropriate suggestions and accessories to match the fit.  
                            Also provide suggestions that suit the user's skin color.
                            Provide suggestions that suit the user's age group.
                            Provide suggestions that is good color combination too
                            so that it looks good on the user and matches well with user's skin tone 
                            and other accessories.
                            Make the suggestions as per current fashion trends.
                            Use the event description to understand the formality and type of event
                            and suggest accordingly.
                            It is not always mandotory to provide suggestions for all four categories.
                            Suggest only the necessary clothing items based on the event description.
                            If the event is just casual that does not need accessories, then skip that.
                            But make sure to suggest at least one clothing item so User is not Naked.
                            If user wants to wear specific type of clothing, then suggest that.
                            But always follow the JSON format while giving cloth suggestions.
                            Use the user preference if he gives any in the event description
                            regarding style or type of clothing.
                            Give it in json format only. Dont use any special characters outside JSON
                            format.
                            Make sure i can just parse the response directly as JSON.
                            If the user provides anything except the event description, ignore that and 
                            if no event description is provided rather the user says something like "surprise me",
                            "give me something new", "i dont know what to wear" then give a 
                            general answer but this time just give the response as text without JSON format.
                            ADITIONAL NOTE : For now there are no accessories in wardrobe,
                            so just suggest accessories as text in the response it wont be embedded or searched from wardrobe.

                            `;


        const chatCompletion = await client.chat.completions.create({
            model: "zai-org/GLM-4.7:novita",
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
        });

        const responseMessage = chatCompletion.choices[0].message.content;

        if(!responseMessage.startsWith("```json")){
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
        next(error);
    }
}
