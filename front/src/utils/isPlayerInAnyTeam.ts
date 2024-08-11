import { TeamPlayer } from "../schemas";

export const isPlayerInAnyTeam = (players:TeamPlayer[] , playerName: string | undefined) => {
    return players.some(player =>
      player.player_name === playerName 
    );
  };