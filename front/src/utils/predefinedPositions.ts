import { TeamPositions } from "../schemas";

export const predefinedPositions: Record<"left" | "right", TeamPositions> = {
    left: {
      Goalkeeper: { x: 9, y: 46 },
      Defender1: { x: 19, y: 15 },
      Defender2: { x: 19, y: 78 },
      Midfielder: { x: 30   , y: 46 },
      Forward: { x: 44, y: 45.5 },
    },
    right: {
      Goalkeeper: { x: 88, y: 47 },
      Defender1: { x: 79, y: 15 },
      Defender2: { x: 79, y: 77 },
      Midfielder: { x: 67, y: 46 },
      Forward: { x: 54, y: 46 },
    },
  };