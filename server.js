import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import session from "express-session";

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = 3000;

app.use(bodyParser.json()); // Middleware to parse JSON request bodies
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from the frontend URL
    methods: "GET,POST",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Session management (not used here but might be intended for future use)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateToken = (email, role) => {
  return jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from header
  if (token == null) return res.sendStatus(403); // Forbidden if no token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token is invalid
    req.user = user; // Attach user info to request object
    next();
  });
};

const authorizeRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).send("Access denied"); // Forbidden if user does not have the required role
  }
  next();
};

// API to send OTP
app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString(); // Generate OTP
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    const hashedOtp = await bcrypt.hash(otp, 10); // Hash OTP before storing
    await pool.query("INSERT INTO otp_requests(email, otp) VALUES($1, $2)", [
      email,
      hashedOtp,
    ]);
    res.send({ success: true }); // Success response
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).send("Error sending OTP"); // Internal server error
  }
});

// API to verify OTP and register user
app.post("/api/verify-otp", async (req, res) => {
  const { email, otp, name, phone, password, classnumber, school } = req.body;
  try {
    const result = await pool.query(
      "SELECT otp FROM otp_requests WHERE email = $1 ORDER BY created_at DESC LIMIT 1",
      [email]
    );
    if (result.rows.length === 0) return res.status(400).send("OTP not found"); // OTP not found
    const storedOtp = result.rows[0].otp;
    const isMatch = await bcrypt.compare(otp, storedOtp); // Verify OTP
    if (!isMatch) return res.status(400).send("Invalid OTP"); // Invalid OTP
    await pool.query("DELETE FROM otp_requests WHERE email = $1", [email]); // Clean up OTP
    const hashedPassword = await bcrypt.hash(password, 10); // Hash user password
    await pool.query(
      "INSERT INTO users(name, email, phone, password, classnumber, school) VALUES($1, $2, $3, $4, $5, $6)",
      [name, email, phone, hashedPassword, classnumber, school]
    );
    const token = generateToken(email, "examinee"); // Generate JWT token with role
    res.send({ success: true, token }); // Success response with token
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send("Error verifying OTP"); // Internal server error
  }
});

// API to verify proctor OTP and register user
app.post("/api/proctorverify-otp", async (req, res) => {
  const { email, otp, name, phone, password, employee_id, school } = req.body;
  try {
    const result = await pool.query(
      "SELECT otp FROM otp_requests WHERE email = $1 ORDER BY created_at DESC LIMIT 1",
      [email]
    );
    if (result.rows.length === 0) return res.status(400).send("OTP not found"); // OTP not found
    const storedOtp = result.rows[0].otp;
    const isMatch = await bcrypt.compare(otp, storedOtp); // Verify OTP
    if (!isMatch) return res.status(400).send("Invalid OTP"); // Invalid OTP
    await pool.query("DELETE FROM otp_requests WHERE email = $1", [email]); // Clean up OTP
    const hashedPassword = await bcrypt.hash(password, 10); // Hash user password
    await pool.query(
      "INSERT INTO supervisors(name, email, phone, password, employee_id, school) VALUES($1, $2, $3, $4, $5, $6)",
      [name, email, phone, hashedPassword, employee_id, school]
    );
    const token = generateToken(email, "examiner"); // Generate JWT token with role
    res.send({ success: true, token }); // Success response with token
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send("Error verifying OTP"); // Internal server error
  }
});

// API to handle user login
app.post("/api/login", async (req, res) => {
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
      if (result.rows.length === 0) {
        return res.status(401).send("Invalid email or password"); // User not found
      }
      role = "examiner";
    }

    const hashedPassword = result.rows[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword); // Verify password
    if (!isMatch) return res.status(401).send("Invalid email or password"); // Invalid password
    const token = generateToken(email, role); // Generate JWT token with role
    res.send({ success: true, token, role }); // Success response with token
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Error logging in"); // Internal server error
  }
});

// Example protected route
app.get("/api/protected", authenticateToken, (req, res) => {
  res.send("This is a protected route");
});

// API to fetch user data
app.get("/api/user-data", authenticateToken, async (req, res) => {
  const email = req.user.email; // Extract email from request object
  try {
    let result = await pool.query(
      "SELECT name, email, phone FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      result = await pool.query(
        "SELECT name, email, phone FROM supervisors WHERE email = $1",
        [email]
      );
      if (result.rows.length === 0) {
        return res.status(404).send("User not found"); // User not found
      }
    }
    res.send(result.rows[0]); // Send user data
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Error fetching user data"); // Internal server error
  }
});

// Route to serve the Proctor Dashboard
app.get(
  "/api/proctor-dashboard",
  authenticateToken,
  authorizeRole("examiner"),
  async (req, res) => {
    // The user is authenticated and authorized
    res.send("Welcome to the Proctor Dashboard");
  }
);

// Route to serve the User Dashboard
app.get("/api/user-dashboard", authenticateToken, async (req, res) => {
  // The user is authenticated
  res.send("Welcome to the User Dashboard");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
