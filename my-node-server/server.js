const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const PORT = 3001;

// Third-party middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// Custom middleware logging sederhana
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ROUTER IMPORT
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const ruteBuku = require("./routes/books");

// ROUTING
app.get("/", (req, res) => {
  res.send("Home Page for API");
});
app.use("/api/books", ruteBuku);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);

// ERROR HANDLER (contoh)
app.use((err, req, res, next) => {
  console.error("Terjadi error:", err.message);
  res.status(500).json({ message: "Terjadi kesalahan pada server." });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
