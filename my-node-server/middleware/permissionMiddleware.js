// middleware/permissionMiddleware.js
const jwt = require("jsonwebtoken");

// Pastikan key tersedia
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET tidak ditemukan di file .env!");
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware untuk autentikasi JWT
 */
exports.authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    // Pastikan header ada dan formatnya benar
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token tidak disediakan atau format salah. Gunakan 'Bearer <token>'."
      });
    }

    const token = authHeader.split(" ")[1]; // Ambil token setelah Bearer

    jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
      if (err) {
        return res.status(403).json({
          message: "Token tidak valid atau telah kedaluwarsa."
        });
      }

      // Simpan data user dari token
      req.user = decodedUser;
      next();
    });
  } catch (error) {
    console.error("❌ ERROR authenticateToken:", error);
    return res.status(500).json({ message: "Kesalahan server dalam verifikasi token." });
  }
};


/**
 * Middleware admin-only
 */
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Tidak memiliki akses. User belum login." });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak. Hanya untuk admin." });
  }

  next();
};
