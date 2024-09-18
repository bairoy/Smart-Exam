import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../models/db.js";
import { generateToken } from "../config/tokenUtil.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let result = await pool.query(
      "SELECT password FROM users WHERE email = $1",
      [email]
    );
    let role = "examinee";
    if (result.rows.length === 0) {
      result = await pool.query(
        "SELECT password FROM supervisors WHERE email = $1",
        [email]
      );
      role = "examiner";
      if (result.rows.length === 0) {
        return res.status(401).send("Invalid email or password");
      }
    }

    const hashedPassword = result.rows[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) return res.status(401).send("Invalid email or password");
    const token = generateToken(email);
    res.send({ success: true, token, role });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Error logging in");
  }
};

export const getUserData = async (req, res) => {
  const email = req.user.email;
  try {
    let result = await pool.query(
      "SELECT name, email, phone FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }

    res.send(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
};

export const getProctorData = async (req, res) => {
  const email = req.user.email;
  try {
    let result = await pool.query(
      "SELECT name, email, phone FROM supervisors WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }

    res.send(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
};
