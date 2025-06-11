import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  BEDROCK,
  BLOCK_SPAWN_RULES,
  CAVE_RADIUS_RANGE
} from './constants.js';

// Tile types:
// 0 = air, 1 = grass, 2 = dirt, 3 = stone, 4 = bedrock, 5 = obsidian, 6 = lava, 7 = marble

export function createWorld() {
  const world = [];

  // --- Surface Generation Noise Settings ---
  const SURFACE_BASE_HEIGHT = Math.floor(WORLD_HEIGHT * 0.5);
  const SURFACE_NOISE_CHANCE = 1;       // 0.0 = flat, 1.0 = wavy
  const SURFACE_NOISE_AMPLITUDE = 1;      // Maximum step up/down per tile
  const SURFACE_MIN_HEIGHT = 3;
  const SURFACE_MAX_HEIGHT = WORLD_HEIGHT - 5;

  // --- Generate a non-flat surface using random walk ---
  let surface = [];
  let lastHeight = SURFACE_BASE_HEIGHT;
  for (let x = 0; x < WORLD_WIDTH; x++) {
    if (Math.random() < SURFACE_NOISE_CHANCE) {
      lastHeight += Math.floor(Math.random() * (2 * SURFACE_NOISE_AMPLITUDE + 1)) - SURFACE_NOISE_AMPLITUDE;
    }
    lastHeight = Math.max(SURFACE_MIN_HEIGHT, Math.min(SURFACE_MAX_HEIGHT, lastHeight));
    surface[x] = lastHeight;
  }

  for (let y = 0; y < WORLD_HEIGHT; y++) {
    world[y] = [];
    for (let x = 0; x < WORLD_WIDTH; x++) {
      if (y >= WORLD_HEIGHT - 2) {
        world[y][x] = BEDROCK; // Bedrock
      } else if (y > surface[x] && y < WORLD_HEIGHT - 2) {
        const depth = y / WORLD_HEIGHT;
        let placed = false;
        for (const rule of BLOCK_SPAWN_RULES) {
          if (depth >= rule.minDepth) {
            const t = (depth - rule.minDepth) / (1 - rule.minDepth);
            const chance = rule.rarity * Math.max(0, Math.min(1, t));
            if (Math.random() < chance) {
              world[y][x] = rule.id;
              placed = true;
              break;
            }
          }
        }
        if (!placed) world[y][x] = 2; // dirt
      } else {
        world[y][x] = 0; // air
      }
    }
  }

  // --- Cave Carving ---
  const cavernAttempts = 5;
  for (let i = 0; i < cavernAttempts; i++) {
    const cx = Math.floor(Math.random() * WORLD_WIDTH);
    const minY = surface[cx] + 2;
    const maxY = WORLD_HEIGHT - 4;
    if (minY >= maxY) continue;
    const cy = Math.floor(minY + Math.random() * (maxY - minY));
    const radius = Math.floor(
      CAVE_RADIUS_RANGE.min +
      Math.random() * (CAVE_RADIUS_RANGE.max - CAVE_RADIUS_RANGE.min + (cy / WORLD_HEIGHT) * 2)
    );

    for (let y = -radius; y <= radius; y++) {
      for (let x = -radius; x <= radius; x++) {
        const nx = cx + x;
        const ny = cy + y;
        if (
          nx > 0 && nx < WORLD_WIDTH - 1 &&
          ny > 0 && ny < WORLD_HEIGHT - 2 &&
          ny > surface[nx]
        ) {
          if (x * x + y * y < radius * radius * (0.7 + Math.random() * 0.6)) {
            world[ny][nx] = 0;
          }
        }
      }
    }
  }

  return world;
}
