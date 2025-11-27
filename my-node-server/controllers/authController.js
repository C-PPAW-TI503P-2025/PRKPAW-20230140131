// controllers/authController.js
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper: ambil secret hanya saat dibutuhkan
function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET tidak ditemukan di environment variables.");
  }
  return process.env.JWT_SECRET;
}

exports.register = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan password harus diisi." });
    }

    if (role && !['mahasiswa', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Role tidak valid. Harus 'mahasiswa' atau 'admin'." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      nama,
      email,
      password: hashedPassword,
      role: role || 'mahasiswa'
    });

    res.status(201).json({
      message: "Registrasi berhasil.",
      user: {
        id: newUser.id,
        nama: newUser.nama,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }
    console.error("Register error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password harus diisi." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah." });
    }

    // ✅ Ambil secret DI DALAM fungsi (setelah dotenv pasti sudah dimuat)
    const JWT_SECRET = getJwtSecret();

    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login berhasil.",
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};