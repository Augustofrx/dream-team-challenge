const express = require("express");
const router = express.Router();
const playerController = require("../controllers/player.controller");
const authenticateToken = require("../middleware/auth");

router.post("/", playerController.createPlayer);
router.get("/", authenticateToken, playerController.getAllPlayers);
router.get("/:id", playerController.getPlayerById);
router.put("/:id", playerController.updatePlayer);
router.delete("/:id", playerController.deletePlayer);

module.exports = router;
