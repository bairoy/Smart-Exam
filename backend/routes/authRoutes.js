import express from "express";
import {
  login,
  getUserData,
  getProctorData,
} from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { addExam } from "../controllers/examController.js";

const router = express.Router();

router.post("/login", login);
router.get("/user-data", authenticateToken, getUserData);
router.get("/proctor-data", authenticateToken, getProctorData);

export default router;
