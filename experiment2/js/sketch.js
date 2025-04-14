// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

/* exported setup, draw */
let seed = 1;

let lightFieldColor;
let darkFieldColor;
let blueColor;
let redColor;
let lightSkyColor;
let darkSkyColor;

let gradientSpeed

let fieldX;
let fieldY;
let fieldWidth;
let fieldHeight;

let players = [];
let playersCount = 22;


function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}
$("#reimagine").click(function () {
  seed++; initializeSky();initializePlayers(); // Reinitialize players with new seed
});
// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();

  background(100);

  lightFieldColor = color(190, 200, 41);
  darkFieldColor = color(151, 171, 5);
  blueColor = color(96, 116, 187);
  redColor = color(206, 47, 48);
  lightSkyColor = color(72, 87, 117);
  darkSkyColor = color(196, 133, 129);

  fieldX = width * 0.15;
  fieldY = height * 0.7;
  fieldWidth = width * 0.7;
  fieldHeight = height * 0.3;

  initializePlayers();
  initializeSky();
}


function draw() {
  randomSeed(seed);
  drawMovingSky(frameCount);
  // Draw the sky background


  stadium();
  field();
  updatePlayers();
}

// Initialize sky properties based on the seed
function initializeSky() {
  randomSeed(seed);
  gradientSpeed = random(0.001, 0.01);
}

// Draw the sky with a moving gradient
function drawMovingSky(time) {

  let offset = sin(time * gradientSpeed) * 0.5 + 0.5;

  let currentSkyColor = lerpColor(lightSkyColor, darkSkyColor, offset);

  // Draw the gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let colorAtY = lerpColor(currentSkyColor, darkSkyColor, inter);
    stroke(colorAtY);
    line(0, y, width, y);
  }
}

function initializePlayers() {
  players = []; // Reset players array
  for (let i = 0; i < playersCount; i++) {
    players.push({

      x: random(fieldX + 5, fieldX + fieldWidth - 5),
      y: random(fieldY + 5, fieldY + fieldHeight - 5),
      dx: random(-1, 1),
      dy: random(-0.5, 0.5),
      color: random() > 0.5 ? redColor : blueColor,
    });

  }
}
function updatePlayers() {
  ellipseMode(CENTER);

  for (let player of players) {
    // Move the players based on their speed
    player.x += player.dx;
    player.y += player.dy;

    // Bounce players if they hit wall
    if (player.x < fieldX + 5 || player.x > fieldX + fieldWidth - 5) {
      player.dx *= -1;
    }
    if (player.y < fieldY + 5 || player.y > fieldY + fieldHeight - 5) {
      player.dy *= -1;
    }

    // Draw the player
    drawPlayer(player.x, player.y, player.color);
  }
}

function drawPlayer(circleX, circleY, color) {
  // Legs
  stroke(color);
  line(circleX, circleY, circleX + 3, circleY + 4);
  line(circleX, circleY, circleX - 3, circleY + 4);

  // Arms
  stroke(color);
  line(circleX, circleY, circleX - 4, circleY - 3);
  line(circleX, circleY, circleX + 4, circleY - 3);

  // Head
  stroke(0);
  fill(0);
  ellipse(circleX, circleY - 4, 3);
}

function field() {
  // Football field border
  stroke(2);
  rect(fieldX, fieldY, fieldWidth, fieldHeight);

  // Football Field stripes using a for loop
  noStroke();
  let stripeWidth = width * 0.05;
  for (let i = 0; i < 14; i++) {
    let x = width * 0.15 + i * stripeWidth;
    if (i % 2 === 0) {
      fill(lightFieldColor);
    } else {
      fill(darkFieldColor);
    }
    rect(x, height * 0.7, stripeWidth, height * 0.3);
  }
}

function stadium() {
  stroke(2);
  ellipseMode(CENTER);

  //randomized steps & scales
  randomSeed(seed);
  let steps = floor(random(5, 15));
  let sizeScaleStart = random(1.2, 1.5);
  let sizeScaleEnd = random(0.6, 0.9);
  let heightScaleStart = random(1.3, 1.7);
  let heightScaleEnd = random(0.4, 0.7);

  //Determine the width and height for each step so they all fit on screen
  let widthStep = (sizeScaleStart - sizeScaleEnd) / (steps - 1);
  let heightStep = (heightScaleStart - heightScaleEnd) / (steps - 1);

  for (let i = 0; i < steps; i++) {
    // Calculate current size
    let currentWidth = sizeScaleStart - widthStep * i;
    let currentHeight = heightScaleStart - heightStep * i;

    // Switch colors
    if (i % 2 === 0) {
      fill(redColor);
    } else {
      fill(blueColor);
    }

    // Draw row
    ellipse(
      width / 2,
      height * 0.9,
      width * currentWidth,
      height * currentHeight
    );
  }
}