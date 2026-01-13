import { Queue } from "bullmq";
import { redis } from "./redis.js";

export const embeddingsQueue = new Queue("embeddings-queue",{
    connection: redis
})