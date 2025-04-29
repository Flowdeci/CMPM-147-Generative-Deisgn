"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function creatureSetup() {
  console.log("creature setup");
  setInterval(moveCreatures, 3000);
  //spawnEnemy();
  setInterval(spawnEnemy, 3000);
  setInterval(moveEnemies, 1000);
}

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();

  // Generate brightness using Perlin noise
  let noiseValue = noise(i * 0.1, j * 0.1, frameCount * 0.01);
  let brightness = lerp(150, 255, noiseValue);

  // Set tile color
  if (isTileMoveable(i, j)) {
    fill(brightness);
  } else {
    fill(50);
  }

  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  // Add a border
  stroke(100, 100, 100, 150);
  strokeWeight(1);
  noFill();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  pop();

  for (let creature of creatures) {
    if (creature.x === i && creature.y === j) {
      drawCreature(creature);
    }
  }

  for (let enemy of enemies) {
    if (i == enemy.x && j == enemy.y) {
      drawEnemy(enemy);
    }
  }
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {
  fill("red");
  text(frameRate(), 20, 20);
}
