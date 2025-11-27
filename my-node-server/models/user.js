'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      // Relasi sesuai Modul 9:
      // Satu user punya banyak presensi
      User.hasMany(models.Presensi, {
        foreignKey: 'userId',
        as: 'presensi'
      });
    }
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('mahasiswa', 'admin'),
      allowNull: false,
      defaultValue: 'mahasiswa'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true
  });

  return User;
};
