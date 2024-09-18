import express from "express";
import {
  sendOtp,
  verifyOtp,
  verifyProctorOtp,
} from "../controllers/otpController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/proctorverify-otp", verifyProctorOtp);

export default router;
