import { GRAVITY, TERMINAL_VELOCITY } from './constants.js';

export const player = {
  x: 20,
  y: 10,
  vx: 0,
  vy: 0,
  width: 0.95,
  height: 0.95,
  speed: 0.008,
  jump: -0.11,
  grounded: false
};

export function movePlayer(world, dx, dy) {
  // Move X axis
  if (dx !== 0) {
    let step = Math.sign(dx) * 0.01; // Small step size
    let moved = 0;
    while (Math.abs(moved) < Math.abs(dx)) {
      let next = Math.abs(dx - moved) < Math.abs(step) ? dx - moved : step;
      player.x += next;
      if (collides(world, player)) {
        player.x -= next;
        break;
      }
      moved += next;
    }
  }

  // Move Y axis
  if (dy !== 0) {
    let step = Math.sign(dy) * 0.01;
    let moved = 0;
    while (Math.abs(moved) < Math.abs(dy)) {
      let next = Math.abs(dy - moved) < Math.abs(step) ? dy - moved : step;
      player.y += next;
      if (collides(world, player)) {
        player.y -= next;
        if (dy > 0) player.grounded = true;
        player.vy = 0;
        break;
      }
      moved += next;
      player.grounded = false;
    }
  }

  // Prevent player from leaving the world bounds
  player.x = Math.max(0, Math.min(player.x, world[0].length - player.width));
  player.y = Math.max(0, Math.min(player.y, world.length - player.height));
}

export function collides(world, entity) {
  const e = entity || player;
  for (let y = Math.floor(e.y); y < Math.ceil(e.y + e.height); y++) {
    for (let x = Math.floor(e.x); x < Math.ceil(e.x + e.width); x++) {
      if (world[y] && world[y][x] && world[y][x] !== 0) return true;
    }
  }
  return false;
}

export function applyPhysics(dt) {
  player.vy += GRAVITY;
  if (player.vy > TERMINAL_VELOCITY) player.vy = TERMINAL_VELOCITY;
}

export function findSpawn(world) {
  const centerX = Math.floor(world[0].length / 2);
  let spawnY = 0;
  // Find the first solid tile from the top at centerX
  for (let y = 0; y < world.length; y++) {
    if (world[y][centerX] !== 0) {
      spawnY = y - 1; // One tile above the solid tile
      break;
    }
  }
  return { x: centerX, y: spawnY };
}