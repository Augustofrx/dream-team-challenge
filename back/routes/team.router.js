const express = require("express");
const router = express.Router();
const teamController = require("../controllers/team.controller");
const authenticateToken = require("../middleware/auth");

router.post("/", teamController.createTeam);
router.get("/", authenticateToken, teamController.getAllTeams);
router.get("/teams-from-league", teamController.getAllTeamsFromLeague);
router.get("/leagues-from-country", teamController.getAllLeaguesFromCountry);
router.get("/countries", teamController.getAllCountries);
router.get("/:id", teamController.getTeamById);
router.put("/:id", teamController.updateTeam);
router.delete("/:id", teamController.deleteTeam);

module.exports = router;
