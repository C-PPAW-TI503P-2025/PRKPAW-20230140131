'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // Tambah kolom latitude jika belum ada
    await queryInterface.addColumn('Presensis', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true
    }).catch(() => {});

    // Tambah kolom longitude jika belum ada
    await queryInterface.addColumn('Presensis', 'longitude', {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true
    }).catch(() => {});
  },

  async down(queryInterface, Sequelize) {

    // Hapus kolom latitude jika ada
    await queryInterface.removeColumn('Presensis', 'latitude')
      .catch(() => {});

    // Hapus kolom longitude jika ada
    await queryInterface.removeColumn('Presensis', 'longitude')
      .catch(() => {});
  }
};
