const { Model, DataTypes } = require("sequelize");

const PLAYERS_TABLE = "Players";

class Player extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: PLAYERS_TABLE,
      modelName: "Player",
      timestamps: true,
    };
  }
}

const playerSchema = {
  player_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  player_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teamSide: {
    type: DataTypes.ENUM("left", "right"),
    allowNull: false,
  },
  player_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  player_type: {
    type: DataTypes.ENUM("Goalkeepers", "Defenders", "Midfielders", "Forwards"),
    allowNull: false,
  },
  teamId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Teams",
      key: "id",
    },
    allowNull: true,
  },
  position: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: { x: 0, y: 0 },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "Users",
      key: "userId",
    },
    onDelete: "CASCADE",
  },
};

module.exports = {
  Player,
  playerSchema,
};
