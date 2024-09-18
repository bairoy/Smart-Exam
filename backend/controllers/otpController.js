import bcrypt from "bcrypt";
import crypto from "crypto";
import pool from "../models/db.js";
import transporter from "../config/transporter.js";
import { generateToken } from "../config/tokenUtil.js";

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    const hashedOtp = await bcrypt.hash(otp, 10);
    await pool.query("INSERT INTO otp_requests(email, otp) VALUES($1, $2)", [
      email,
      hashedOtp,
    ]);
    res.send({ success: true });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).send("Error sending OTP");
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp, name, phone, password, classnumber, school } = req.body;
  try {
    const result = await pool.query(
      "SELECT otp FROM otp_requests WHERE email = $1 ORDER BY created_at DESC LIMIT 1",
      [email]
    );
    if (result.rows.length === 0) return res.status(400).send("OTP not found");
    const storedOtp = result.rows[0].otp;
    const isMatch = await bcrypt.compare(otp, storedOtp);
    if (!isMatch) return res.status(400).send("Invalid OTP");
    await pool.query("DELETE FROM otp_requests WHERE email = $1", [email]);
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users(name, email, phone, password, classnumber, school) VALUES($1, $2, $3, $4, $5, $6)",
      [name, email, phone, hashedPassword, classnumber, school]
    );
    const token = generateToken(email, "examinee");
    res.send({ success: true, token });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send("Error verifying OTP");
  }
};

export const verifyProctorOtp = async (req, res) => {
  const { email, otp, name, phone, password, employee_id, school } = req.body;
  try {
    const result = await pool.query(
      "SELECT otp FROM otp_requests WHERE email = $1 ORDER BY created_at DESC LIMIT 1",
      [email]
    );
    if (result.rows.length === 0) return res.status(400).send("OTP not found");
    const storedOtp = result.rows[0].otp;
    const isMatch = await bcrypt.compare(otp, storedOtp);
    if (!isMatch) return res.status(400).send("Invalid OTP");
    await pool.query("DELETE FROM otp_requests WHERE email = $1", [email]);
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO supervisors(name, email, phone, password, employee_id, school) VALUES($1, $2, $3, $4, $5, $6)",
      [name, email, phone, hashedPassword, employee_id, school]
    );
    const token = generateToken(email, "examiner");
    res.send({ success: true, token });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send("Error verifying OTP");
  }
};
