const teamRoutes = require("./team.router");
const playerRoutes = require("./player.router");
const authRouter = require("./auth.router");

const express = require("express");

function routerApi(app) {
  const router = express.Router();
  app.use("/api/", router);
  router.use("/teams", teamRoutes);
  router.use("/players", playerRoutes);
  router.use("/auth", authRouter);
}

module.exports = routerApi;
