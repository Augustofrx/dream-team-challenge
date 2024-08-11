import { TeamPlayer } from "../schemas";

export const isTeamFull = (players:TeamPlayer[] , team: "left" | "right") => {
    const teamCount = players.filter(player => player.teamSide === team).length;
    return teamCount >= 5;
  };
  