// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const PORT = 3009;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// Custom logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
const authRoutes = require("./routes/auth");
const booksRoutes = require("./routes/books");
const presensiRoutes = require("./routes/presensi");
const reportsRoutes = require("./routes/reports");

// ✅ Validasi: router harus berupa fungsi
[
  { name: "authRoutes", route: authRoutes },
  { name: "booksRoutes", route: booksRoutes },
  { name: "presensiRoutes", route: presensiRoutes },
  { name: "reportsRoutes", route: reportsRoutes },
].forEach(({ name, route }) => {
  if (typeof route !== "function") {
    console.error(`❌ ${name} tidak valid! Harus berupa Express Router (fungsi).`);
    process.exit(1);
  }
});

// API Endpoints
app.get("/", (req, res) => {
  res.json({ message: "API Presensi Mahasiswa - UMY" });
});
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportsRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Terjadi kesalahan pada server." });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});