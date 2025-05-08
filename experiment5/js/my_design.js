/* exported getInspirations, initDesign, renderDesign, mutateDesign */

function getInspirations() {
  return [
    {
      name: "ViscaBarca",
      assetUrl:
        "https://cdn.glitch.global/5c4b678d-31be-4162-a131-71cd7841214b/ViscaBarca.webp?v=1746472765957",
      credit:
        "From the official FCB website, my favorite picture of the stadium",
    },
    {
      name: "BarcaStadium",
      assetUrl:
        "https://cdn.glitch.global/5c4b678d-31be-4162-a131-71cd7841214b/EquipBarca.avif?v=1746477859526",
      credit: "Amazing picture of the Barcelona stadium",
    },
    {
      name: "ForcaBarca",
      assetUrl:
        "https://cdn.glitch.global/5c4b678d-31be-4162-a131-71cd7841214b/ForcaBarca.webp?v=1746472777141",
      credit: "Forca Barca",
    },
  ];
}

let design;
let skyTime = 0;

// Some propertions
const FIELD_HEIGHT_PCT = 0.13;
const BOWL_HEIGHT_PCT = 0.65;
const BOWL_WIDTH_PCT = 1.35;

function initDesign(inspiration) {
  resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);

  const baseSize = min(width, height) / 62;
  const colorScheme = ["#FF0000", "#0000FF", "#FFFF00"];
  const fieldY = height - FIELD_HEIGHT_PCT * height;
  const bowlHeight = BOWL_HEIGHT_PCT * height;
  const bowlWidth = width * BOWL_WIDTH_PCT;
  const rows = floor(bowlHeight / (baseSize * 0.85));
  const cols = floor(width / (baseSize * 0.72));

  design = {
    baseSize,
    colorScheme,
    shapes: [],
    cols,
    rows,
    fieldY,
    bowlTopY: fieldY - bowlHeight,
    bowlBotY: fieldY,
    bowlHeight,
    bowlWidth,
  };

  // Filling the crowd with spheres
  for (let r = 0; r < rows - 2; r++) {
    let fracY = r / (rows - 1);
    let y = fieldY - fracY * bowlHeight;

    //Lesss spheres at the top
    let thisCols = floor(cols * sqrt(1 - fracY));
    if (thisCols <= 1) continue;

    let normEllipseY = 1 - fracY;
    let xSpan = (bowlWidth / 2) * sqrt(normEllipseY);

    for (let c = 0; c < thisCols; c++) {
      let fracX = thisCols === 1 ? 0.5 : c / (thisCols - 1);
      let x = width / 2 + map(fracX, 0, 1, -xSpan, xSpan);

      //make sure spheres are instead thee stadium shape
      let ellipseVal =
        sq((x - width / 2) / (bowlWidth / 2)) + sq((y - fieldY) / bowlHeight);
      if (ellipseVal <= 1.001) {
        //Crowd fades at the top
        let fade = 1;
        if (fracY < 0.03) fade = map(fracY, 0, 0.03, 0.1, 1);
        else if (fracY > 0.97) fade = map(fracY, 0.97, 1, 1, 0.15);

        let size = random(baseSize * 0.9, baseSize * 1.13);
        let color = colorScheme[floor(random(colorScheme.length))];
        let phase = random(TWO_PI);
        let jitterX = random(-baseSize * 0.18, baseSize * 0.18);
        let jitterY = random(-baseSize * 0.13, baseSize * 0.13);
        design.shapes.push({
          x: x + jitterX,
          y: y + jitterY,
          baseY: y + jitterY,
          size,
          color,
          phase,
          fade,
        });
      }
    }
  }

  return design;
}

function renderDesign(design, inspiration) {
  drawSkyGradient(design);
 drawStadiumBowl(design);
  for (let shape of design.shapes) {
    let yWobble =
      shape.baseY + 2 * sin(frameCount * 0.07 + shape.phase + shape.x * 0.03);
    fill(shape.color);
    noStroke();
    ellipse(shape.x, yWobble, shape.size);
  }

  drawField(design);
}

function drawSkyGradient(design) {
  skyTime += 0.008;
  const skyPaletteTop = [
    color(50, 120, 255),
    color(255, 140, 0),
    color(230, 80, 200),
    color(80, 180, 250),
  ];
  const skyPaletteBottom = [
    color(255, 190, 120),
    color(255, 80, 120),
    color(160, 80, 230),
    color(200, 210, 255),
  ];
  let t = (skyTime / 4) % 1;
  let idx = floor(t * (skyPaletteTop.length - 1));
  let frac = (t * (skyPaletteTop.length - 1)) % 1;
  let topCol = lerpColor(
    skyPaletteTop[idx],
    skyPaletteTop[(idx + 1) % skyPaletteTop.length],
    frac
  );
  let botCol = lerpColor(
    skyPaletteBottom[idx],
    skyPaletteBottom[(idx + 1) % skyPaletteBottom.length],
    frac
  );

  //Draw the sky gradient
  for (let y = 0; y < design.fieldY; y++) {
    let amt = map(y, 0, design.fieldY, 0, 1);
    let skyColor = lerpColor(topCol, botCol, amt);
    stroke(skyColor);
    line(0, y, width, y);
  }
}

function drawStadiumBowl(design) {
  fill(110, 110, 110, 170); 
  noStroke();
  beginShape();
  let steps = 140;
  let bowlWidth = design.bowlWidth * 1.06; 
  let bowlHeight = design.bowlHeight * 1.05; 
  for (let i = 0; i <= steps; i++) {
    let theta = PI + (i / steps) * PI;
    let x = width / 2 + (bowlWidth / 2) * cos(theta);
    let y = design.fieldY - bowlHeight * pow(sin(theta), 0.74);
    vertex(x, y);
  }
  vertex(width / 2 + bowlWidth / 2, design.fieldY);
  vertex(width / 2 - bowlWidth / 2, design.fieldY);
  endShape(CLOSE);
}
function drawField(design) {
  fill("#228B22");
  noStroke();
  rect(0, design.fieldY, width, height - design.fieldY);
}

// Sphere colors based on closet color to them
function closestBarcaColor(r, g, b) {
  const barcaColors = [
    { c: "#FF0000", rgb: [255, 0, 0] },
    { c: "#0000FF", rgb: [0, 0, 255] },
    { c: "#FFFF00", rgb: [255, 255, 0] },
  ];
  let best = barcaColors[0];
  let bestDist = 99999;
  for (let entry of barcaColors) {
    let d = dist(r, g, b, ...entry.rgb);
    if (d < bestDist) {
      best = entry;
      bestDist = d;
    }
  }
  return best.c;
}

function mutateDesign(design, inspiration, rate) {
  inspiration.image.loadPixels();
  for (let i = 0; i < design.shapes.length; i++) {
    let shape = design.shapes[i];
    if (random(1) < rate) {
      //Choose a random color sometimes
      if (rate > 0.95 && random(1) < 0.4) {
        shape.color = random(design.colorScheme);
      } else {
        //Use inspiertaiton from image
        let ix = floor(
          constrain(
            map(shape.x, 0, width, 0, inspiration.image.width - 1),
            0,
            inspiration.image.width - 1
          )
        );
        let iy = floor(
          constrain(
            map(shape.baseY, 0, height, 0, inspiration.image.height - 1),
            0,
            inspiration.image.height - 1
          )
        );
        let idx = 4 * (iy * inspiration.image.width + ix);
        let r = inspiration.image.pixels[idx];
        let g = inspiration.image.pixels[idx + 1];
        let b = inspiration.image.pixels[idx + 2];
        shape.color = closestBarcaColor(r, g, b);
      }
      // Move the spheres a little
      shape.size += randomGaussian(0, 1);
      shape.size = constrain(
        shape.size,
        design.baseSize * 0.7,
        design.baseSize * 1.5
      );
      shape.baseY += randomGaussian(0, 0.4);
      shape.baseY = constrain(shape.baseY, design.bowlTopY, design.fieldY);
      shape.x += randomGaussian(0, 0.4);
      shape.x = constrain(shape.x, 0, width);
    }
  }
}
