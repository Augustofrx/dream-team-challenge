const { models } = require("../libs/sequelize");

class PlayerService {
  constructor() {}

  async createPlayer(data) {
    try {
      const player = await models.Player.create(data);
      return player;
    } catch (error) {
      throw new Error(`Error creating player: ${error.message}`);
    }
  }

  async getAllPlayers(userId) {
    try {
      const players = await models.Player.findAll({ where: { userId } });
      return players;
    } catch (error) {
      throw new Error(`Error fetching players: ${error.message}`);
    }
  }

  async getPlayerById(id) {
    try {
      const player = await models.Player.findByPk(id);
      if (!player) {
        throw new Error("Player not found");
      }
      return player;
    } catch (error) {
      throw new Error(`Error fetching player: ${error.message}`);
    }
  }

  async updatePlayer(id, data) {
    try {
      const player = await models.Player.findByPk(id);
      if (!player) {
        throw new Error("Player not found");
      }
      await player.update(data);
      return player;
    } catch (error) {
      throw new Error(`Error updating player: ${error.message}`);
    }
  }

  async deletePlayer(id) {
    try {
      const player = await models.Player.findByPk(id);
      if (!player) {
        throw new Error("Player not found");
      }
      await player.destroy();
      return player;
    } catch (error) {
      throw new Error(`Error deleting player: ${error.message}`);
    }
  }
}

module.exports = PlayerService;
