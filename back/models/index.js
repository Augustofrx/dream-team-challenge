const { Team, teamSchema } = require("./team.model");
const { Player, playerSchema } = require("./player.model");
const initModels = require("./initModels");
const { User, userSchema } = require("./user.model");

function setupModels(sequelize) {
  User.init(userSchema, User.config(sequelize));
  Team.init(teamSchema, Team.config(sequelize));
  Player.init(playerSchema, Player.config(sequelize));

  initModels(sequelize);
}

module.exports = setupModels;
