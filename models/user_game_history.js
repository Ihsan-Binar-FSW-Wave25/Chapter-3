"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_game_history extends Model {
    
    static associate(models) {
      // define association here
      user_game_history.belongsTo(models.user_game, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
    }
  }
  
  user_game_history.init(
    {
      user_id: DataTypes.INTEGER,
      win: DataTypes.INTEGER,
      lose: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "user_game_history",
    }
  );

  return user_game_history;
};
