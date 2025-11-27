// controllers/reportController.js
const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const records = await Presensi.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay,
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ["id", "nama", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const data = records.map(r => ({
      id: r.id,
      userId: r.userId,
      nama: r.user ? r.user.nama : "User tidak ditemukan",
      email: r.user ? r.user.email : null,
      checkIn: r.checkIn ? new Date(r.checkIn).toISOString() : null,
      checkOut: r.checkOut ? new Date(r.checkOut).toISOString() : null,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
    }));

    res.json({
      reportDate: startOfDay.toISOString().split("T")[0],
      total: records.length,
       data,
    });
  } catch (error) {
    console.error("Error di getDailyReport:", error);
    res.status(500).json({ message: "Gagal mengambil laporan harian." });
  }
};

exports.getMyReport = async (req, res) => {
  try {
    const records = await Presensi.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    const data = records.map(r => ({
      id: r.id,
      checkIn: r.checkIn ? new Date(r.checkIn).toISOString() : null,
      checkOut: r.checkOut ? new Date(r.checkOut).toISOString() : null,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
    }));

    res.json({
      total: records.length,
       data,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil laporan pribadi." });
  }
};
