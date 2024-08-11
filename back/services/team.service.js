const { models } = require("../libs/sequelize");
const axios = require("axios");

const dotenv = require("dotenv");
dotenv.config();

const API_KEY = process.env.API_KEY;

class TeamService {
  constructor() {}

  async createTeam(data) {
    try {
      const teamCount = await models.Team.count({
        where: { userId: data.userId },
      });
      const leftTeam = await models.Team.findOne({
        where: { teamSide: "left", userId: data.userId },
      });

      if (teamCount >= 2) {
        throw new Error("No se pueden crear más de dos equipos.");
      }

      if (!leftTeam) {
        data.teamSide = "left";
      } else {
        data.teamSide = "right";
      }

      const team = await models.Team.create(data);
      return team;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async getAllTeamsFromLeague(leagueId) {
    try {
      const teams = await axios.get(
        `https://apiv3.apifootball.com/?action=get_teams&league_id=${leagueId}&APIkey=${API_KEY}`
      );
      return teams.data;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async getAllLeaguesFromCountry(countryId) {
    try {
      const leagues = await axios.get(
        `https://apiv3.apifootball.com/?action=get_leagues&country_id=${countryId}&APIkey=${API_KEY}`
      );

      return leagues.data;
    } catch (error) {
      throw new Error(`Error fetching leagues: ${error.message}`);
    }
  }

  async getAllCountries() {
    try {
      const countries = await axios.get(
        `https://apiv3.apifootball.com/?action=get_countries&APIkey=${API_KEY}`
      );
      return countries.data;
    } catch (error) {
      throw new Error(`Error fetching countries ${error.message}`);
    }
  }

  async getAllTeams(userId) {
    try {
      const teams = await models.Team.findAll({ where: { userId } });
      return teams;
    } catch (error) {
      throw new Error(`Error fetching teams: ${error.message}`);
    }
  }

  async getTeamById(id) {
    try {
      const team = await models.Team.findByPk(id);
      if (!team) {
        throw new Error("Team not found");
      }
      return team;
    } catch (error) {
      throw new Error(`Error fetching team: ${error.message}`);
    }
  }

  async updateTeam(id, data) {
    try {
      const team = await models.Team.findByPk(id);
      if (!team) {
        throw new Error("Team not found");
      }
      await team.update(data);
      return team;
    } catch (error) {
      throw new Error(`Error updating team: ${error.message}`);
    }
  }

  async deleteTeam(id) {
    try {
      const team = await models.Team.findByPk(id);
      if (!team) {
        throw new Error("Team not found");
      }
      await team.destroy();
      return team;
    } catch (error) {
      throw new Error(`Error deleting team: ${error.message}`);
    }
  }
}

module.exports = TeamService;
