"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class user_game extends Model {
    
    static associate(models) {
      
      user_game.hasMany(models.user_game_biodata, {
        foreignKey: "user_id",
      });
      user_game.hasMany(models.user_game_history, {
        foreignKey: "user_id",
      });
    }
  }

  user_game.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user_game",
    }
  );

  return user_game;
};
