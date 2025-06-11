import { TILE_SIZE, WORLD_WIDTH, WORLD_HEIGHT, GRAVITY } from './constants.js';
import { createWorld } from './world.js';
import { player, movePlayer, applyPhysics, findSpawn } from './player.js';
import { camX, camY, updateCamera, getCameraOffset } from './camera.js';
import { keys, scale, setupInput } from './input.js';
import { getMouseTile } from './util.js';
import { draw } from './render.js';

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let world = createWorld();
let hoverTile = null;

const getHoverTile = setupInput(
  canvas,
  e => getMouseTile(e, canvas, scale, { x: camX, y: camY }, TILE_SIZE),
  world, WORLD_WIDTH, WORLD_HEIGHT
);

function initWorld(seed) {
  world = createWorld(seed);
  const spawn = findSpawn(world);
  player.x = spawn.x;
  player.y = spawn.y;
  player.vx = 0;
  player.vy = 0;
  updateCamera(player, TILE_SIZE, canvas, scale);
  hoverTile = null;
}

function update(dt) {
  player.vx = 0;
  if (keys["a"]) player.vx = -player.speed * dt;
  if (keys["d"]) player.vx = player.speed * dt;

  if (player.grounded && keys["w"]) {
    player.vy = player.jump;
    player.grounded = false;
  }
  applyPhysics(dt);

  movePlayer(world, player.vx, 0);
  movePlayer(world, 0, player.vy);

  updateCamera(player, TILE_SIZE, canvas, scale);
}

let last = 0;
function loop(timestamp) {
  const dt = timestamp - last;
  last = timestamp;
  update(dt);
  hoverTile = getHoverTile();
  draw(ctx, canvas, scale, camX, camY, world, player, hoverTile);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

document.getElementById('generateBtn').addEventListener('click', () => {
  const seedValue = document.getElementById('seedInput').value;
  const seed = parseInt(seedValue);
  initWorld(isNaN(seed) ? 6745 : seed);
});
