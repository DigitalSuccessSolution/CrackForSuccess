const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

console.log("Current directory:", process.cwd());
console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  "https://crack4success.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:51730",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/track", require("./routes/trackRoutes"));
app.use("/api/job", require("./routes/jobPrepRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
