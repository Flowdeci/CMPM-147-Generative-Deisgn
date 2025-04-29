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
let ufos = []; 
function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {}

let planetsToDraw = [];

function p3_drawTile(i, j) {
  noStroke(); // Ensure no stroke
  let tileColor = color(0);
  fill(tileColor);

  push();

  // Slightly extend the tile edges
  const overlap = 1;
  beginShape();
  vertex(-tw - overlap, 0);
  vertex(0, th + overlap);
  vertex(tw + overlap, 0);
  vertex(0, -th - overlap);
  endShape(CLOSE);

  

  // Stars
  if (XXH.h32("tile:" + [i, j], worldSeed) % 8 === 0) {
    let hash = XXH.h32("star:" + [i, j], worldSeed);

    // Use noise for smooth flickering
    let t = frameCount * 0.01; // Time component for smooth flicker
    let brightness = noise(hash + t) * 90 + 150;

    // Set star color with smooth brightness variation
    let hueShift = noise(hash + t + 10) * 100 - 15; // Hue shift ±15
    let starColor = color(
      brightness + hueShift,
      brightness,
      brightness - hueShift
    );

    // rabndom size based on hash
    let starSize = map(hash % 100, 0, 99, 3, 7);

    // Draw the star
    fill(starColor);
    ellipse(0, 0, starSize, starSize);
  }

  if (XXH.h32("tile:" + [i, j], worldSeed) % 40 === 0) {
    for (let k = 0; k < 5; k++) {
      // 5 stars per cluster
      let offsetX = random(-10, 10);
      let offsetY = random(-10, 10);
      let starSize = random(1, 3);
      let brightness = random(180, 255);
      fill(brightness);
      ellipse(offsetX, offsetY, starSize, starSize);
    }
  }

  pop();

  //Plannentnsssss
  if (XXH.h32("planet:" + [i, j], worldSeed) % 50 === 0) {
    let hash = XXH.h32("planet:" + [i, j], worldSeed);
    let planetColor = color(hash % 256, (hash >> 8) % 256, (hash >> 16) % 256);

    let matrix = drawingContext.getTransform();

    // Extract the x and y translation values
    let xTranslation = matrix.m41;
    let yTranslation = matrix.m42;

    let planetSize = tw * (2 + (hash % 4));

    planetsToDraw.push({
      i: xTranslation,
      j: yTranslation,
      noiseSeed: hash,
      initialColor: planetColor,
      initialSize: planetSize,
    });
  }
}

function p3_drawAfter() {
   // Update and draw 
  for (let i = ufos.length - 1; i >= 0; i--) {
    let ufo = ufos[i];
    
    ufo.x += ufo.dx;
    ufo.y += ufo.dy;

    // remove ufo after 20 seconds
    if (millis() - ufo.createdAt > 20000) {
      ufos.splice(i, 1);
      continue;
    }
    
    drawUFO(ufo.x, ufo.y);
  }
  for (let planet of planetsToDraw) {
    push();
    translate(planet.i, planet.j);

    // Use noise to calculate small color variations
    let t = frameCount * 0.01;
    let baseR = red(planet.initialColor);
    let baseG = green(planet.initialColor);
    let baseB = blue(planet.initialColor);
    //Restrict the color variaiotn chnages
    let r = constrain(baseR + noise(planet.noiseSeed + 0, t) * 60 - 20, 0, 255);
    let g = constrain(baseG + noise(planet.noiseSeed + 1, t) * 60 - 20, 0, 255);
    let b = constrain(baseB + noise(planet.noiseSeed + 2, t) * 60 - 20, 0, 255);

    //Use noise for smooth size transitions
    let baseSize = planet.initialSize;
    let size = baseSize + noise(planet.noiseSeed + 3, t) * 8 - 2;

    // Draw the planet
    fill(r, g, b);
    noStroke()
    ellipse(0, 0, size, size);
    
    // Add craters or wavy lines based on hash
    let hash = planet.noiseSeed;
    if (hash % 3 === 0) {
      // Add craters
      drawCraters(size, hash);
    } else if (hash % 3 === 1) {
      // Add wavy lines
      drawWavyLines(size, hash);
    }

    
  
    pop();
  }

  // Cclear the array for overloading purposes
  planetsToDraw = [];
  
  
  //Small chace to draw  commetnsui9o89786jnh7bg65f4d3
  if (random() < 0.01) {
  
    let cometX = random(width);
    let cometY = random(height);
    let cometLength = random(100, 1000);
    stroke(255, 255, 200, 150);
    strokeWeight(2);
    line(cometX, cometY, cometX - cometLength, cometY - cometLength);
  }
}

function p3_tileClicked(i, j) {
  spawnUFO(mouseX, mouseY);
}

function spawnUFO(x, y) {
  let angle = random(TWO_PI); 
  let speed = random(1, 3); 

  ufos.push({
    x: x,
    y: y,
    dx: cos(angle) * speed, 
    dy: sin(angle) * speed, 
    createdAt: millis() 
  });
}

function drawUFO(x, y) {
  push();
  translate(x, y);

  // body
  fill(200, 200, 255);
  noStroke();
  ellipse(0, 0, 30, 15); 

  //ufo head
  fill(150, 150, 255, 180); 
  ellipse(0, -5, 20, 10);

  pop();
}


function drawWavyLines(size, seed) {
  let lineCount = Math.floor(noise(seed) * 5) + 4; 
  let baseHue = noise(seed) * 360; 

  for (let i = 0; i < lineCount; i++) {
    let yOffset = map(i, 0, lineCount - 1, -size * 0.4, size * 0.4); 
    let waveAmplitude = size * 0.1; 
    let waveFrequency = 5; 

    // Set color with slight hue variation
    let hueShift = noise(seed + i) * 60 - 30; // Hue variation ±30
    let bandColor = color((baseHue + hueShift) % 360, 80, 60, 150);
    stroke(bandColor);
    strokeWeight(size * 0.02);
    noFill();

    // Draw wavy line
    beginShape();
    for (let x = -size * 0.5; x <= size * 0.5; x += size * 0.05) {
      let y = yOffset + sin((x / size) * TWO_PI * waveFrequency) * waveAmplitude;
      //clip the cuvers if they go outside the line
      if (dist(0, 0, x, y) < size * 0.5) {
        curveVertex(x, y);
      }
    }
    endShape();
  }
}



function drawCraters(size, seed) {
  let craterCount = Math.floor(noise(seed) * 10) + 5; 

  for (let i = 0; i < craterCount; i++) {
    // Use deterministic values for placement
    let angle = map(XXH.h32(seed + i, worldSeed) % 100, 0, 99, 0, TWO_PI);
    let distance = map(XXH.h32(seed + i + 1, worldSeed) % 100, 0, 99, size * 0.2, size * 0.4); 

    let x = cos(angle) * distance;
    let y = sin(angle) * distance;

    let craterSize = map(XXH.h32(seed + i + 2, worldSeed) % 100, 0, 99, size * 0.05, size * 0.1); 

    // Draw the crater
    fill(0, 0, 0, 50);
    noStroke();
    ellipse(x, y, craterSize, craterSize);
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
  fill("red");
  text("tile " + [i, j], 0, 0);
}
