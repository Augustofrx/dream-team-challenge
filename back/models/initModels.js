const initModels = (sequelize) => {
  const { Team, Player, User } = sequelize.models;

  User.hasMany(Team, {
    foreignKey: "userId",
    as: "teams",
    onDelete: "CASCADE",
  });
  Team.belongsTo(User, { foreignKey: "userId", as: "user" });

  Team.hasMany(Player, {
    foreignKey: "teamId",
    as: "players",
    onDelete: "CASCADE",
  });
  Player.belongsTo(Team, { foreignKey: "teamId", as: "team" });
};

module.exports = initModels;
