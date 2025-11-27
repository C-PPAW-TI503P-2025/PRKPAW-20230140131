// controllers/presensiController.js
const { Presensi, User } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const { latitude, longitude } = req.body;

    // Validasi koordinat
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Koordinat lokasi diperlukan untuk check-in." });
    }

    // Cek apakah sudah ada sesi aktif (belum check-out)
    const active = await Presensi.findOne({ where: { userId, checkOut: null } });
    if (active) {
      return res.status(400).json({ message: "Anda sudah check-in hari ini." });
    }

    // ✅ Simpan check-in dengan koordinat lokasi
    const record = await Presensi.create({
      userId,
      checkIn: now,
      latitude: latitude,
      longitude: longitude
    });

    const user = await User.findByPk(userId, { attributes: ["nama"] });

    res.status(201).json({
      message: `Halo ${user.nama}, check-in berhasil pukul ${format(now, "HH:mm:ss", { timeZone })} WIB`,
      data: {
        userId: record.userId,
        nama: user.nama,
        checkIn: format(record.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOut: null,
        latitude: record.latitude,
        longitude: record.longitude,
      },
    });
  } catch (err) {
    console.error("Check-in error:", err);
    res.status(500).json({ message: "Gagal check-in", error: err.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // ✅ Perbaikan utama: tambahkan `as: 'user'` sesuai alias di model
    const record = await Presensi.findOne({
      where: { userId, checkOut: null },
      include: [
        {
          model: User,
          as: 'user', // ← WAJIB: sesuai dengan `as` di `Presensi.belongsTo(User, { as: 'user' })`
          attributes: ["nama"]
        }
      ],
    });

    if (!record) {
      return res.status(404).json({ message: "Tidak ada sesi check-in aktif." });
    }

    // ✅ Update check-out time (koordinat sudah tersimpan saat check-in)
    record.checkOut = now;
    await record.save();

    res.json({
      message: `Selamat jalan ${record.user.nama}, check-out berhasil pukul ${format(now, "HH:mm:ss", { timeZone })} WIB`,
      data: {
        userId: record.userId,
        nama: record.user.nama,
        checkIn: format(record.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOut: format(record.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        latitude: record.latitude,
        longitude: record.longitude,
      },
    });
  } catch (err) {
    console.error("Check-out error:", err);
    res.status(500).json({ message: "Gagal check-out", error: err.message });
  }
};

exports.getReport = async (req, res) => {
  try {
    // Ambil semua data presensi dengan informasi user
    const records = await Presensi.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ["nama", "email"]
        }
      ],
      order: [['checkIn', 'DESC']]
    });

    res.json({
      message: "Data presensi berhasil diambil",
      data: records
    });
  } catch (err) {
    console.error("Get report error:", err);
    res.status(500).json({ message: "Gagal mengambil data presensi", error: err.message });
  }
};

exports.deletePresensi = async (req, res) => {
  try {
    const { id } = req.params;
    const presensi = await Presensi.findByPk(id);
    if (!presensi) return res.status(404).json({ message: "Data tidak ditemukan." });
    if (presensi.userId !== req.user.id) {
      return res.status(403).json({ message: "Bukan data milik Anda." });
    }
    await presensi.destroy();
    res.status(204).send(); // No Content
  } catch (err) {
    console.error("Delete presensi error:", err);
    res.status(500).json({ message: "Gagal menghapus data.", error: err.message });
  }
};

exports.updatePresensi = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut } = req.body;
    const presensi = await Presensi.findByPk(id);
    if (!presensi) return res.status(404).json({ message: "Data tidak ditemukan." });

    if (checkIn) presensi.checkIn = new Date(checkIn);
    if (checkOut !== undefined) presensi.checkOut = checkOut ? new Date(checkOut) : null;

    await presensi.save();
    res.json({ message: "Data berhasil diperbarui.", data: presensi });
  } catch (err) {
    console.error("Update presensi error:", err);
    res.status(500).json({ message: "Gagal memperbarui data.", error: err.message });
  }
};