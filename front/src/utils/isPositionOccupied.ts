import { Position, Team, TeamPlayer } from "../schemas";

const COLLISION_RADIUS = 10

export const isPositionOccupied = (players: TeamPlayer[] ,position: Position, selectedTeam: Team | null): boolean => {
    return players.some((player) => {
      if (player.teamSide !== selectedTeam) return false;
      const posX = player.position?.x ?? 0;
      const posY = player.position?.y ?? 0;
      const distance = Math.sqrt(Math.pow(position.x - posX, 2) + Math.pow(position.y - posY, 2));
      return distance < COLLISION_RADIUS;
    });
  };
