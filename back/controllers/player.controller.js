const PlayerService = require("../services/player.service");
const playerService = new PlayerService();

const createPlayer = async (req, res) => {
  try {
    const player = await playerService.createPlayer(req.body);
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllPlayers = async (req, res) => {
  try {
    const players = await playerService.getAllPlayers(req.user.id);
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlayerById = async (req, res) => {
  try {
    const player = await playerService.getPlayerById(req.params.id);
    res.status(200).json(player);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updatePlayer = async (req, res) => {
  try {
    const player = await playerService.updatePlayer(req.params.id, req.body);
    res.status(200).json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePlayer = async (req, res) => {
  try {
    const player = await playerService.deletePlayer(req.params.id);
    res.status(200).json(player);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  createPlayer,
  getAllPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
};
