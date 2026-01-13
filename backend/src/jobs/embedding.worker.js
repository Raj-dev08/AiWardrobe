import { Worker } from "bullmq";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import { connectDB } from "../lib/db.js";
import axios from "axios";
import { BottomClothes } from "../model/bottom.model.js";
import { TopClothes } from "../model/top.model.js";
import { Shoes } from "../model/shoes.model.js";
import { Accessories } from "../model/accessories.model.js";

await connectDB();

const embeddingsWorkerLink = process.env.EMBEDDINGS_WORKER_LINK + "/embed-image" || "http://127.0.0.1:1000/embed-image";

// console.log("Embeddings Worker connected to:", embeddingsWorkerLink);

const embeddingsWorker = new Worker("embeddings-queue", async (job) => {
    switch (job.name) {
        case "processEmbeddingsForTop": {
            const { userId, image } = job.data;

            const uploadedResponse = await cloudinary.uploader.upload(image)
            const imageUrl = uploadedResponse.secure_url;

            const response = await axios.post(embeddingsWorkerLink, {
                image_url: imageUrl
            })

            const embedding = response.data.embedding;

            await TopClothes.findOneAndUpdate(
                { userId },
                {
                    $push: {
                        tops: {
                            imageUrl,
                            embedding
                        }
                    }
                }
            )
            break;
        }
        case "processEmbeddingsForBottom": {
            const { userId, image } = job.data;

            const uploadedResponse = await cloudinary.uploader.upload(image)
            const imageUrl = uploadedResponse.secure_url;

            const response = await axios.post(embeddingsWorkerLink, {
                image_url: imageUrl
            })

            const embedding = response.data.embedding;

            await BottomClothes.findOneAndUpdate(
                { userId },
                {
                    $push: {
                        bottoms: {
                            imageUrl,
                            embedding
                        }
                    }
                }
            )
            break;
        }
        case "processEmbeddingsForShoes": {
            const { userId, image } = job.data;

            const uploadedResponse = await cloudinary.uploader.upload(image)
            const imageUrl = uploadedResponse.secure_url;

            const response = await axios.post(embeddingsWorkerLink, {
                image_url: imageUrl
            })

            const embedding = response.data.embedding;

            await Shoes.findOneAndUpdate(
                { userId },
                {
                    $push: {
                        shoes: {
                            imageUrl,
                            embedding
                        }
                    }
                }
            )
            break;
        }
        case "processEmbeddingsForAccessories": {
            const { userId, image } = job.data;

            const uploadedResponse = await cloudinary.uploader.upload(image)
            const imageUrl = uploadedResponse.secure_url;

            const response = await axios.post(embeddingsWorkerLink, {
                image_url: imageUrl
            })

            const embedding = response.data.embedding;

            await Accessories.findOneAndUpdate(
                { userId },
                {
                    $push: {
                        accessories: {
                            imageUrl,
                            embedding
                        }
                    }
                }
            )
            break;
        }

        default:
            break;
    }
   
}, {
    connection: redis
});

embeddingsWorker.on("completed", (job) => {
    console.log(`Job ${job.name} completed successfully`);
});

embeddingsWorker.on("failed", (job, err) => {
    console.error(`Job ${job.name} failed with error: ${err.message}`);
});