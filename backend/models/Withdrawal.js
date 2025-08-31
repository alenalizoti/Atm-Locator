"use strict";

const { Model, DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  class Withdrawal extends Model {
    static associate(models) {
      Withdrawal.belongsTo(models.User, { foreignKey: "user_id" });
      Withdrawal.belongsTo(models.Atm, { foreignKey: "atm_id" });
      Withdrawal.belongsTo(models.Card, { foreignKey: "card_id" });
    }
  }
  Withdrawal.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      card_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      atm_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      method: {
        type: DataTypes.ENUM,
        values: ["QR", "PIN"],
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      receipt: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
      tableName: "withdrawals",
      underscored: true,
      sequelize,
    }
  );
  return Withdrawal;
};
