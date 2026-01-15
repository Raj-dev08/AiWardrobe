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

const embeddingsWorker = new Worker(
  "embeddings-queue",
  async (job) => {
    const { userId, image, wardrobeId } = job.data;

    const uploaded = await cloudinary.uploader.upload(image);
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
  console.error(`Job ${job?.name} failed:`, err);
});
