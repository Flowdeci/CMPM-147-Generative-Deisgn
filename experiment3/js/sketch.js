// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate fi

/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;
let overworld = false;

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  if (overworld) {
    select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
    reparseGrid();
  } else {
    select("#asciiBox").value(gridToString(dungeonGenerateGrid(numCols, numRows)));
    reparseGrid();
  }
}

function switchWorldType() {
  overworld = !overworld;
  if (overworld) {
    select("#worldGenerationReport").html("Overworld");
    currentGrid = generateGrid(numCols, numRows);
  } else {
    select("#worldGenerationReport").html("Dungeon");
    currentGrid = dungeonGenerateGrid(numCols, numRows);
  }

  regenerateGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(16 * numCols, 16 * numRows);
  canvas.parent("canvas-container");

  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);
  select("#worldGenerationButton").mousePressed(switchWorldType);
  select("#worldGenerationReport").html("Overworld");

  reseed();

  // resize canvas is the page is resized

  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();

}


function draw() {
  randomSeed(seed);
  if (overworld) {
    drawGrid(currentGrid);
  } else {
    
    drawDungeonGrid(currentGrid);
  }
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}
