// routes/reports.js
const express = require("express");
const router = express.Router();

// Middleware auth
const { authenticateToken } = require("../middleware/permissionMiddleware");

// Controller laporan
const reportsController = require("../controllers/reportController");

// Routes laporan
router.get("/daily", authenticateToken, reportsController.getDailyReport);
router.get("/my", authenticateToken, reportsController.getMyReport);

module.exports = router;
