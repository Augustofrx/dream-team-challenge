const { Model, DataTypes } = require("sequelize");

const TEAMS_TABLE = "Teams";

class Team extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: TEAMS_TABLE,
      modelName: "Team",
      timestamps: true,
    };
  }
}

const teamSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    field: "name",
  },
  teamSide: {
    type: DataTypes.ENUM("left", "right"),
    allowNull: false,
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
  Team,
  teamSchema,
};
