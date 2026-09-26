const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/scores");
const leaderboardRoutes = require("./routes/leaderboard");

const app = express();

// --------------- Middleware ---------------

// CORS - allow frontend origins (local + production)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://www.urja-nitjsr.com",
  "https://urja-nitjsr.com",
  "https://aditya1006gt.github.io",
  "https://shivani-968.github.io",
];

if (process.env.FRONTEND_URL) {
  try {
    const parsed = new URL(process.env.FRONTEND_URL);
    if (!allowedOrigins.includes(parsed.origin)) {
      allowedOrigins.push(parsed.origin);
    }
  } catch {
    const cleaned = process.env.FRONTEND_URL.replace(/\/$/, "");
    if (!allowedOrigins.includes(cleaned)) {
      allowedOrigins.push(cleaned);
    }
  }
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".github.io") ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// --------------- Routes ---------------

app.get("/", (req, res) => {
  res.json({ message: "URJA 2026 API is running 🏃" });
});

app.use("/api/auth", authRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// --------------- Start Server ---------------

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
