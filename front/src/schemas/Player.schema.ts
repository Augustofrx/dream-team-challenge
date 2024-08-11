export interface Player {
    player_id: number;
    player_name: string;
    player_image: string;
    player_type: "Goalkeepers" | "Defenders" | "Midfielders" | "Forwards";
  }