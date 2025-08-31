"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Atm extends Model {
    static associate(models) {
      Atm.belongsTo(models.Bank, { foreignKey: "bank_id" });
      Atm.belongsToMany(models.User, {
        through: "favorites",
        foreignKey: "atm_id",
        otherKey: "user_id",
      });
    }
  }
  Atm.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      api_atm_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      bank_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
      },
      supports_qr: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      supports_pin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "atms",
      sequelize,
    }
  );
  return Atm;
};
