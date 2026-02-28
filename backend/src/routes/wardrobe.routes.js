import { Router } from "express";
import { createWardrobe, getMyWardrobe, addClothingItem, removeClothingItem } from "../controller/wardrobe.controller.js";

const router = Router();

router.post("/", createWardrobe);
router.get("/me", getMyWardrobe);
router.post("/add-item", addClothingItem);
router.delete("/remove-item/:clothId", removeClothingItem);

export default router;