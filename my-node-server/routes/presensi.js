// routes/presensi.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/permissionMiddleware");
const presensiController = require("../controllers/presensiController");

router.post("/check-in", authenticateToken, presensiController.checkIn);
router.post("/check-out", authenticateToken, presensiController.checkOut);
router.get("/report", authenticateToken, presensiController.getReport);
router.delete("/:id", authenticateToken, presensiController.deletePresensi);
router.put("/:id", authenticateToken, presensiController.updatePresensi);

module.exports = router;