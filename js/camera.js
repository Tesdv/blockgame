import { WORLD_WIDTH, WORLD_HEIGHT, TILE_SIZE, CAMERA_SMOOTHING, CAMERA_MARGIN } from './constants.js';

export let camX = 0;
export let camY = 0;

export function getCameraOffset(player, tileSize, canvas, scale) {
  return {
    x: player.x * tileSize - canvas.width / 2 + tileSize / 2,
    y: player.y * tileSize - canvas.height / 2 + tileSize / 2
  };
}

function clampCamera(x, y, canvas, scale) {
  const worldPixelWidth = WORLD_WIDTH * TILE_SIZE;
  const worldPixelHeight = WORLD_HEIGHT * TILE_SIZE;

  const minX = CAMERA_MARGIN;
  const minY = CAMERA_MARGIN;
  const maxX = Math.max(worldPixelWidth - canvas.width, minX);
  const maxY = Math.max(worldPixelHeight - canvas.height, minY);

  return {
    x: Math.min(Math.max(x, minX), maxX),
    y: Math.min(Math.max(y, minY), maxY)
  };
}

export function updateCamera(player, tileSize, canvas, scale) {
  const offset = getCameraOffset(player, tileSize, canvas, scale);
  // Linear interpolation for smooth camera movement
  camX += (offset.x - camX) * CAMERA_SMOOTHING;
  camY += (offset.y - camY) * CAMERA_SMOOTHING;

  // Clamp camera to world bounds
  const clamped = clampCamera(camX, camY, canvas, scale);
  camX = clamped.x;
  camY = clamped.y;
}
