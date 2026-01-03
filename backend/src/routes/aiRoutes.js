import express from "express";
import { generateSessionInsights } from "../controllers/aiController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/analyze-session", protectRoute, generateSessionInsights);

export default router;
