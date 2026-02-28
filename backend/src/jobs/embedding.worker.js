import { Worker } from "bullmq";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import { connectDB } from "../lib/db.js";
import axios from "axios";

import Wardrobe from "../model/wardrobe.model.js";
import { TopClothes } from "../model/top.model.js";
import { BottomClothes } from "../model/bottom.model.js";
import { Shoes } from "../model/shoes.model.js";

await connectDB();

const embeddingsWorkerLink =
  process.env.EMBEDDINGS_WORKER_LINK
    ? `${process.env.EMBEDDINGS_WORKER_LINK}/embed-image`
    : "http://127.0.0.1:1000/embed-image";

const backgroundWorkerLink =
  process.env.EMBEDDINGS_WORKER_LINK
    ? `${process.env.EMBEDDINGS_WORKER_LINK}/remove-background`
    : "http://127.0.0.1:1000/remove-background";


const embeddingsWorker = new Worker(
  "embeddings-queue",
  async (job) => {
    const { userId, image, wardrobeId } = job.data;

    const { data: backgroundRemovedData } = await axios.post(backgroundWorkerLink, {
      image,
    });

    const backgroundRemovedImage = `data:image/jpeg;base64,${backgroundRemovedData.image_base64}`;
    
    const transfromation={ crop : "limit"} //typo but whatever
    if (job.name === "processEmbeddingsForTop") {
      transfromation.height = 495;
      transfromation.width = 504;
    }

    else if (job.name === "processEmbeddingsForBottom") {
      transfromation.height = 500;
      transfromation.width = 500;
    }

    else if (job.name === "processEmbeddingsForShoes") {
      transfromation.height = 377;
      transfromation.width = 612;
    }


    const uploaded = await cloudinary.uploader.upload(
      backgroundRemovedImage,
      { resource_type: "image", format: "png" , transformation: transfromation}
    );
    const imageUrl = uploaded.secure_url;

   
    const { data } = await axios.post(embeddingsWorkerLink, {
      image_url: imageUrl,
    });

    const embedding = data.embedding;

    if (job.name === "processEmbeddingsForTop") {
      const top = await TopClothes.create({
        userId,
        imageUrl,
        embedding,
      });

      await Wardrobe.findByIdAndUpdate(wardrobeId, {
        $push: { top: top._id },
      });
    }

    if (job.name === "processEmbeddingsForBottom") {
      const bottom = await BottomClothes.create({
        userId,
        imageUrl,
        embedding,
      });

      await Wardrobe.findByIdAndUpdate(wardrobeId, {
        $push: { bottom: bottom._id },
      });
    }

    if (job.name === "processEmbeddingsForShoes") {
      const shoes = await Shoes.create({
        userId,
        imageUrl,
        embedding,
      });

      await Wardrobe.findByIdAndUpdate(wardrobeId, {
        $push: { shoes: shoes._id },
      });
    }
  },
  {
    connection: redis,
  }
);

embeddingsWorker.on("completed", (job) => {
  console.log(`Job ${job.name} completed`);
});

embeddingsWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.name} failed:`);
});
