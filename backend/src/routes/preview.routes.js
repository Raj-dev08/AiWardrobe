import { Router } from "express";
import { createModel, customizeModel, getModel } from "../controller/preview.controller.js";

const router = Router();

router.get("/", getModel);
router.post("/create-model", createModel);
router.put("/customize-model", customizeModel);

export default router;