"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_game_biodata extends Model {
    
    static associate(models) {
      // define association here
      user_game_biodata.belongsTo(models.user_game, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
    }
  }
  
  user_game_biodata.init(
    {
      user_id: DataTypes.INTEGER,
      full_name: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user_game_biodata",
    }
  );

  return user_game_biodata;
};
