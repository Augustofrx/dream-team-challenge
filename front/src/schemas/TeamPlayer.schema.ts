import { Player } from "./Player.schema";
import { PlayerRole } from "./PlayerRole.schema";


export interface TeamPlayer extends Player {
    team?: "left" | "right";
    position?: { x: number; y: number };
    role?: PlayerRole;
    teamSide?:  "left" | "right";
  }