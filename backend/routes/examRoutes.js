// backend/routes/examRoutes.js
import express from "express";
import { addExam } from "../controllers/examController.js";
import { getExamDetail } from "../controllers/examController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/submitexam", addExam);
router.get("/exam-data", authenticateToken, getExamDetail);

export default router;
