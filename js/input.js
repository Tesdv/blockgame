import { BEDROCK, INTERACT_RANGE } from './constants.js';
import { player } from './player.js';

export const keys = {};
export let scale = 1;

export function setupInput(canvas, getMouseTile, world, worldWidth, worldHeight) {
  document.addEventListener("keydown", e => {
    keys[e.key] = true;
  });
  document.addEventListener("keyup", e => {
    keys[e.key] = false;
  });

  // Clear all keys if the window loses focus
  window.addEventListener("blur", () => {
    for (const k in keys) keys[k] = false;
  });

  let hoverTile = null;
  canvas.addEventListener("mousemove", e => {
    const { mx, my } = getMouseTile(e);
    const dx = Math.abs(mx + 0.5 - (player.x + player.width / 2));
    const dy = Math.abs(my + 0.5 - (player.y + player.height / 2));
    if (
      dx <= INTERACT_RANGE &&
      dy <= INTERACT_RANGE &&
      mx >= 0 && mx < worldWidth &&
      my >= 0 && my < worldHeight
    ) {
      hoverTile = { mx, my, breaking: e.shiftKey };
    } else {
      hoverTile = null;
    }
  });
  canvas.addEventListener("mouseleave", () => {
    hoverTile = null;
  });

  // Listen for Shift key changes to update highlight color
  document.addEventListener("keydown", e => {
    if (hoverTile && (e.key === "Shift" || e.key === "ShiftLeft" || e.key === "ShiftRight")) {
      hoverTile.breaking = true;
    }
  });
  document.addEventListener("keyup", e => {
    if (hoverTile && (e.key === "Shift" || e.key === "ShiftLeft" || e.key === "ShiftRight")) {
      hoverTile.breaking = false;
    }
  });

  canvas.addEventListener("click", e => {
    const { mx, my } = getMouseTile(e);
    const dx = Math.abs(mx + 0.5 - (player.x + player.width / 2));
    const dy = Math.abs(my + 0.5 - (player.y + player.height / 2));
    if (dx <= INTERACT_RANGE && dy <= INTERACT_RANGE) {
      if (mx >= 0 && mx < worldWidth && my >= 0 && my < worldHeight) {
        if (e.shiftKey) {
          // Only break if not bedrock
          if (world[my][mx] !== BEDROCK) {
            world[my][mx] = 0;
          }
        } else {
          // Only place if the tile is empty and not overlapping the player
          const px = player.x;
          const py = player.y;
          const pw = player.width;
          const ph = player.height;
          // Check if the tile overlaps the player's bounding box
          if (
            world[my][mx] === 0 &&
            (mx + 1 <= px || mx >= px + pw || my + 1 <= py || my >= py + ph)
          ) {
            world[my][mx] = 2;
          }
        }
      }
    }
  });
  return () => hoverTile;
}