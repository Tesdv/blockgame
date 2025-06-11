export function getMouseTile(e, canvas, scale, camOffset, tileSize) {
  const rect = canvas.getBoundingClientRect();
  const screenX = e.clientX - rect.left;
  const screenY = e.clientY - rect.top;
  const worldX = (screenX / scale) + camOffset.x;
  const worldY = (screenY / scale) + camOffset.y;
  const mx = Math.floor(worldX / tileSize);
  const my = Math.floor(worldY / tileSize);
  return { mx, my };
}