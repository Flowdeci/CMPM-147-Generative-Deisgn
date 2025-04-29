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
let clicks = {}; // Track the number of clicks per tile
let flowerGrowths = []; // Track flower growth animations

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

function getGradientColor(noiseValue, noiseOffset) {
  let deepWaterColor = color(0, 51, 102);
  let midWaterColor = color(32, 100, 170);
  let shallowWaterColor = color(64, 164, 223);
  let veryLightBlue = color(173, 216, 230);

  let sandColor = color(237, 201, 175);
  let goldenSandColor = color(255, 228, 181);
  let darkGrassColor = color(34, 139, 34);
  let lightGrassColor = color(50, 205, 50);

  if (noiseValue < 0.2) {
    let t = noiseValue / 0.2 + noiseOffset;
    t = constrain(t, 0, 1);
    return lerpColor(deepWaterColor, midWaterColor, t);
  } else if (noiseValue < 0.4) {
    let t = (noiseValue - 0.2) / 0.2 + noiseOffset;
    t = constrain(t, 0, 1);
    return lerpColor(midWaterColor, veryLightBlue, t);
  } else if (noiseValue < 0.55) {
    let t = (noiseValue - 0.4) / 0.15;
    return lerpColor(sandColor, goldenSandColor, t);
  } else {
    let t = (noiseValue - 0.55) / (1 - 0.55);
    return lerpColor(lightGrassColor, darkGrassColor, t);
  }
}

function shouldHaveTree(i, j, noiseValue) {
  if (noiseValue >= 0.55) {
    return XXH.h32("tile:" + [i, j], worldSeed) % 8 === 0;
  }
  return false;
}

function drawTree(x, y, size) {
  let trunkHeight = size * 0.7;
  let top = size * 0.8;

  stroke(139, 69, 19);
  strokeWeight(2);
  line(x, y, x, y - trunkHeight);

  noStroke();
  fill(34, 139, 34);
  ellipse(x, y - trunkHeight, top, top);
}

let fish = {};

function shouldHaveFish(i, j, noiseValue) {
  if (noiseValue < 0.4) {
    return XXH.h32("fish:" + [i, j], worldSeed) % 10 === 0;
  }
  return false;
}

function drawFish(x, y) {
  push();
  translate(x, y);

  fill(255, 165, 0);
  noStroke();
  ellipse(0, 0, 8, 5);

  fill(255, 140, 0);
  triangle(-4, 0, -8, -3, -8, 3);

  fill(255, 165, 0);
  triangle(-2, -3, 0, -5, 2, -3);

  fill(0);
  ellipse(2, -1, 1, 1);

  pop();
}

function drawGrass(i, j, size) {
  let numBlades = 10; // Reduced number of grass blades for better performance
  let bladeHeight = size * 0.6;
  let bladeWidth = size * 0.05;

  for (let b = 0; b < numBlades; b++) {
    let seed = XXH.h32(`grass:${i},${j},${b}`, worldSeed);
    let offsetX = map(seed % 1000, 0, 1000, -tw / 2, tw / 2);
    let offsetY = map((seed >> 10) % 1000, 0, 1000, -th / 2, th / 2);

    let time = millis() * 0.005;
    let sway = sin(time + b + seed) * bladeWidth * 2;

    stroke(0, 128 + (seed % 50), 0);
    strokeWeight(1);
    line(offsetX, offsetY, offsetX + sway, offsetY - bladeHeight);
  }
}

function drawFlower(growth) {
  let size = map(growth.progress, 0, 1, 0, 10); // Flower size grows from 0 to 10
  let stemHeight = map(growth.progress, 0, 1, 0, 20); // Stem height grows from 0 to 20

  // Deterministic flower position based on tile seed and growth index
  let seed = XXH.h32(`flower:${growth.i},${growth.j},${growth.index}`, worldSeed);
  let flowerX = map(seed % 1000, 0, 1000, -tw / 2, tw / 2);
  let flowerY = map((seed >> 10) % 1000, 0, 1000, -th / 2, th / 2);

  // Deterministic flower color
  let r = 200 + (seed % 55); // Red component
  let g = 100 + ((seed >> 8) % 155); // Green component
  let b = 100 + ((seed >> 16) % 155); // Blue component

  // Draw the stem
  stroke(34, 139, 34); // Green stem
  strokeWeight(2);
  line(flowerX, flowerY, flowerX, flowerY - stemHeight);

  // Draw the flower
  noStroke();
  fill(r, g, b); // Consistent flower color
  ellipse(flowerX, flowerY - stemHeight, size, size);

  // Update growth progress
  growth.progress += 0.004; // Increase growth progress (extended lifespan)
}

function p3_drawTile(i, j) {
  noStroke();

  let scale = 0.1;
  let noiseValue = noise(i * scale, j * scale);

  let tileSeed = XXH.h32("tile:" + [i, j], worldSeed) % 1000;
  let time = millis() * 0.001;
  let tileNoise = noise(i + tileSeed, j + tileSeed, time) * 0.3;

  let tileColor = getGradientColor(noiseValue, tileNoise);

  fill(tileColor);

  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  pop();

  if (shouldHaveTree(i, j, noiseValue)) {
    drawTree(0, -th / 2, 15);
  }

  if (noiseValue >= 0.55) {
    drawGrass(i, j, 10);
  }

  // Draw flower growth animations
  for (let growth of flowerGrowths) {
    if (growth.i === i && growth.j === j) {
      drawFlower(growth);
    }
  }

  // Remove finished growths
  flowerGrowths = flowerGrowths.filter((growth) => growth.progress < 1);
}

function p3_tileClicked(i, j) {
  let key = `${i},${j}`;
  clicks[key] = 1 + (clicks[key] || 0);

  let scale = 0.1;
  let noiseValue = noise(i * scale, j * scale);

  if (noiseValue >= 0.55) {
    // Add 3 to 5 flowers for this click
    let flowerCount = random([3, 4, 5]);
    for (let index = 0; index < flowerCount; index++) {
      flowerGrowths.push({
        i,
        j,
        index, // Unique index for deterministic position and color
        progress: 0, // Growth progress (0 to 1)
      });
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

  let key = `${i},${j}`;
  let clickCount = clicks[key] || 0;
  noStroke();
  fill(0);
  text(`Tile ${i},${j}\nClicks: ${clickCount}`, 0, 0);
}

function p3_drawAfter() {}