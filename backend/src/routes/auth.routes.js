import { Router } from "express";
import { signup, login, logout, checkAuth , updateExpoPushToken} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/check-auth", protectRoute, checkAuth);
router.put("/update-expo-push-token", protectRoute, updateExpoPushToken);

export default router;