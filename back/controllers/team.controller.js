const TeamService = require("../services/team.service");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const { JWT_SECRET } = process.env;

const teamService = new TeamService();

const createTeam = async (req, res) => {
  try {
    const team = await teamService.createTeam(req.body);
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getAllTeams = async (req, res) => {
  try {
    const teams = await teamService.getAllTeams(req.user.id);
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const isImageUrlValid = async (url) => {
  try {
    const response = await fetch(url, { method: "GET" });
    return response.ok;
  } catch (error) {
    return false;
  }
};

const getAllTeamsFromLeague = async (req, res) => {
  try {
    const { leagueId } = req.query;
    const teams = await teamService.getAllTeamsFromLeague(leagueId);

    const validatedTeams = await Promise.all(
      teams.map(async (team) => {
        const validatedPlayers = await Promise.all(
          team.players.map(async (player) => {
            const isValidImage = await isImageUrlValid(player.player_image);
            return {
              ...player,
              player_image: isValidImage
                ? player.player_image
                : "/noplayer.png",
            };
          })
        );

        return {
          ...team,
          players: validatedPlayers,
        };
      })
    );

    res.status(200).json(validatedTeams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ message: "Error fetching teams" });
  }
};

const getAllLeaguesFromCountry = async (req, res) => {
  try {
    const { countryId } = req.query;
    const leagues = await teamService.getAllLeaguesFromCountry(countryId);

    const validatedLeagues = await Promise.all(
      leagues.map(async (league) => {
        const isValidImage = await isImageUrlValid(league.league_logo);
        return {
          ...league,
          league_logo: isValidImage ? league.league_logo : "/flag.png",
        };
      })
    );

    res.status(200).json(validatedLeagues);
  } catch (error) {
    console.error("Error fetching leagues:", error);
    res.status(500).json({ message: "Error fetching leagues" });
  }
};

const getAllCountries = async (req, res) => {
  try {
    const countries = await teamService.getAllCountries();

    const validatedCountries = await Promise.all(
      countries.map(async (country) => {
        const isValidImage = await isImageUrlValid(country.country_logo);
        return {
          ...country,
          country_logo: isValidImage ? country.country_logo : "/flag.png",
        };
      })
    );

    res.status(200).json(validatedCountries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ message: "Error fetching countries" });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await teamService.getTeamById(req.params.id);
    res.status(200).json(team);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateTeam = async (req, res) => {
  try {
    const team = await teamService.updateTeam(req.params.id, req.body);
    res.status(200).json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const team = await teamService.deleteTeam(req.params.id);
    res.status(200).json(team);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  createTeam,
  getAllTeams,
  getAllTeamsFromLeague,
  getAllLeaguesFromCountry,
  getAllCountries,
  getTeamById,
  updateTeam,
  deleteTeam,
};
