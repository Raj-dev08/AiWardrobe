import { Router } from "express";
import { createWardrobe, getMyWardrobe, addClothingItem, removeClothingItem } from "../controller/wardrobe.controller.js";

const router = Router();

router.post("/", createWardrobe);
router.get("/me", getMyWardrobe);
router.post("/add-item", addClothingItem);
router.post("/remove-item", removeClothingItem);

export default router;