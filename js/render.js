import { TILE_SIZE, TILE_COLORS, WORLD_WIDTH, WORLD_HEIGHT } from './constants.js';

export function draw(ctx, canvas, scale, camX, camY, world, player, hoverTile) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(scale, scale);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);
  ctx.translate(-camX, -camY);

  // Calculate visible tile range based on camera position
  const startX = Math.max(0, Math.floor(camX / TILE_SIZE) - 2);
  const endX = Math.min(WORLD_WIDTH, Math.ceil((camX + canvas.width) / TILE_SIZE) + 2);
  const startY = Math.max(0, Math.floor(camY / TILE_SIZE) - 2);
  const endY = Math.min(WORLD_HEIGHT, Math.ceil((camY + canvas.height) / TILE_SIZE) + 2);

  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const tile = world[y][x];
      if (tile && tile !== 0) {
        ctx.fillStyle = TILE_COLORS[tile];
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

        // If this is dirt and air is above, draw a 1-pixel green line on top
        if (
          tile != 6 && // dirt
          y > 0 && world[y - 1][x] === 0 // air above
        ) {
          ctx.fillStyle = "#00cc00"; // grass green
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, 0.15 * TILE_SIZE); // 1 pixel tall line
        }
      }
    }
  }

  ctx.fillStyle = "#FF0000";
  ctx.fillRect(player.x * TILE_SIZE, player.y * TILE_SIZE, player.width * TILE_SIZE, player.height * TILE_SIZE);

  if (
    hoverTile &&
    hoverTile.mx >= 0 && hoverTile.mx < WORLD_WIDTH &&
    hoverTile.my >= 0 && hoverTile.my < WORLD_HEIGHT
  ) {
    ctx.strokeStyle = hoverTile.breaking ? "#FF4444" : "#FFFF00"; // Red if breaking, yellow otherwise
    ctx.lineWidth = 2 / scale;
    ctx.strokeRect(
      hoverTile.mx * TILE_SIZE,
      hoverTile.my * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    );
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}