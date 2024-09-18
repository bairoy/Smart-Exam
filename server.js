import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import authRoutes from "./backend/routes/authRoutes.js";
import otpRoutes from "./backend/routes/otpRoutes.js";
import examRoutes from "./backend/routes/examRoutes.js";

import {
  authenticateToken,
  authorizeRole,
} from "./backend/middlewares/authMiddleware.js";
import dotenv from "dotenv";

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

// Use the defined routes
app.use("/api", authRoutes);
app.use("/api", otpRoutes);
app.use("/api", examRoutes);

// Example protected route
app.get("/api/protected", authenticateToken, (req, res) => {
  res.send("This is a protected route");
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
app.get("/", (req, res) => {
  res.send("welcome to the backend");
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
