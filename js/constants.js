export const TILE_SIZE = 80;
export const WORLD_WIDTH = 50;
export const WORLD_HEIGHT = 80;
export const GRAVITY = 0.0025;
export const TERMINAL_VELOCITY = 0.4;
export const TILE_COLORS = [
  "#000000", // air
  "#00cc00", // grass
  "#8B4513", // dirt
  "#555555", // stone
  "#222222", // bedrock
  "#3b1f4a", // obsidian
  "#ff6600",  // lava (orange-red)
  "#eaeaea" // marble (light gray)
];

export const BLOCK_SPAWN_RULES = [
  { id: 3, minDepth: 0.4, rarity: 0.15 }, // stone
  { id: 5, minDepth: 0.6, rarity: 0.02 }, // obsidian
  { id: 7, minDepth: 0.6, rarity: 0.02 }, // marble: appears below 30% depth, rare
  { id: 6, minDepth: 0.65, rarity: 0.05 } // lava: appears below 85% depth, uncommon
];

export const BEDROCK = 4;

export const CAMERA_SMOOTHING = 0.04;
export const CAMERA_MARGIN = 0;
export const INTERACT_RANGE = 3;

export const CAVE_RADIUS_RANGE = { min: 2, max: 2 }; // min and max radius for caves