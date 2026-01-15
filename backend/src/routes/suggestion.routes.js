import { Router } from "express";
import { getSuggestions } from "../controller/getsuggestion.controller.js";

const router = Router();

router.post("/", getSuggestions);

export default router;