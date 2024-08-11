import { PlayerRole, Team, TeamPlayer } from "../schemas";

export const validateRoleCount = (players: TeamPlayer[], team: Team, role: PlayerRole) => {
  if(players.length === 0) return false



  if (role === "Defender1" || role === "Defender2") {
    const defenderCount = players.filter(
      player => player.teamSide === team && (player.role === "Defender1" || player.role === "Defender2")
    ).length;
    return defenderCount >= 2;
  }

  const roleCount = players.filter(
    player => player.teamSide === team && player.role === role
  ).length;



  return roleCount > 0; 
};
