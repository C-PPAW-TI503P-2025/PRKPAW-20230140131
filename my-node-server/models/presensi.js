'use strict';
module.exports = (sequelize, DataTypes) => {
  const Presensi = sequelize.define('Presensi', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    }
  }, {
    tableName: 'Presensis',
    timestamps: true
  });

  Presensi.associate = function (models) {
    Presensi.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Presensi;
};
