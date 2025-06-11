import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  BEDROCK,
  BLOCK_SPAWN_RULES,
  CAVE_RADIUS_RANGE
} from './constants.js';

import { Noise } from './util.js';

// Tile types:
// 0 = air, 1 = grass, 2 = dirt, 3 = stone, 4 = bedrock, 5 = obsidian, 6 = lava, 7 = marble

function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export function createWorld(seed = 6742) {
  const world = [];

  const rng = mulberry32(seed);
  const noise = new Noise(seed / 10000);
  
  const baseHeight = Math.floor(WORLD_HEIGHT * 0.5);
  const amplitude = 5;
  const frequency = 0.05;

  let surface = [];
  for (let x = 0; x < WORLD_WIDTH; x++) {
    const nx = x * frequency;
    let height = Math.floor(baseHeight + noise.simplex2(nx, 0) * amplitude);
    height = Math.max(3, Math.min(WORLD_HEIGHT - 5, height));
    surface[x] = height;
  }

  for (let y = 0; y < WORLD_HEIGHT; y++) {
    world[y] = [];
    for (let x = 0; x < WORLD_WIDTH; x++) {
      if (y >= WORLD_HEIGHT - 2) {
        world[y][x] = BEDROCK;
      } else if (y > surface[x] && y < WORLD_HEIGHT - 2) {
        const depth = y / WORLD_HEIGHT;
        let placed = false;
        for (const rule of BLOCK_SPAWN_RULES) {
          if (depth >= rule.minDepth) {
            const t = (depth - rule.minDepth) / (1 - rule.minDepth);
            const chance = rule.rarity * Math.max(0, Math.min(1, t));
            if (rng() < chance) {
              world[y][x] = rule.id;
              placed = true;
              break;
            }
          }
        }
        if (!placed) world[y][x] = 2;
      } else {
        world[y][x] = 0;
      }
    }
  }

const cavernAttempts = Math.floor((WORLD_WIDTH + WORLD_HEIGHT) * 0.08);

for (let i = 0; i < cavernAttempts; i++) {
  let cx = Math.floor(rng() * WORLD_WIDTH);
  const surfaceLimit = surface[cx];
  const bufferFromSurface = 6;
  const minY = surfaceLimit + bufferFromSurface;
  const maxY = WORLD_HEIGHT - 4;

  if (minY >= maxY) continue;

  let cy = Math.floor(minY + rng() * (maxY - minY));

  const blobs = 1 + Math.floor(rng() * 3);
  
  for (let b = 0; b < blobs; b++) {
    const radiusBase = CAVE_RADIUS_RANGE.min + rng() * (CAVE_RADIUS_RANGE.max - CAVE_RADIUS_RANGE.min);
    const depthFactor = 1 + (cy / WORLD_HEIGHT);
    const radius = Math.floor(radiusBase * depthFactor);

    for (let y = -radius; y <= radius; y++) {
      for (let x = -radius; x <= radius; x++) {
        const nx = cx + x;
        const ny = cy + y;

        if (
          nx > 0 && nx < WORLD_WIDTH - 1 &&
          ny > 0 && ny < WORLD_HEIGHT - 2 &&
          ny > surface[nx] + bufferFromSurface - 2
        ) {
          const dist = Math.sqrt(x * x + y * y);
          const edgeNoise = (rng() - 0.5) * 0.2;
          const threshold = radius * (0.75 + edgeNoise);
          if (dist < threshold) {
            world[ny][nx] = 0;
          }
        }
      }
    }

    cx += Math.floor((rng() - 0.5) * radius * 0.8);
    cy += Math.floor((rng() - 0.3) * radius * 0.5);
    cy = Math.max(minY, Math.min(maxY, cy));
  }
}
  console.log(`World generated with seed ${seed}`);
  return world;
}
