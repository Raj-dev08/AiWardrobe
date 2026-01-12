import { Router } from "express";
import { createModel, customizeModel } from "../controller/preview.controller.js";

const router = Router();

router.post("/create-model", createModel);
router.put("/customize-model", customizeModel);

export default router;