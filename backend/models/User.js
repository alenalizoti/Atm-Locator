"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Card, { foreignKey: "user_id" });
      User.hasMany(models.Withdrawal, { foreignKey: "user_id" });
      User.belongsToMany(models.Atm, {
        through: "favorites",
        foreignKey: "user_id",
        otherKey: "atm_id",
        as: "favorite_atms",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [6, 255],
        },
      },
      avatar_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["male", "female"],
      },
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: true,
      sequelize,
    }
  );

  return User;
};
