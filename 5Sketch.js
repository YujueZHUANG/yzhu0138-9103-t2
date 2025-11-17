
// Sketch — Main scene setup and rendering everything.

/*
 Canvas scaling from original 600×500 to 1000x800 with 960+20px margin both sides.
 Handles overall intergration including background, railmap, Mondrian town, and car animation.
*/


// Setup
const BASE_W = 1000;
const BASE_H = 800;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  initTownGrid();
  initOutlineBlocks();
  initGridBlocks();
  initMondrianTown();

  initCars();
  initSeaParticles();

}


// Draw
function draw() {
  background(255);

  let s = min(width / BASE_W, height / BASE_H);
  let ox = (width - BASE_W * s) * 0.5;
  let oy = (height - BASE_H * s) * 0.5;

  push();
  translate(ox, oy);
  scale(s);

  push();
  translate(20, 0);
  scale(960 / original_W, 800 / original_H);

  // 1) Background
  drawSea();

  // 2) Mondrian Town
  drawMondrianTown();
  drawTownGrid();
  drawGridBlocks();
  drawTownOutline();
  drawOutlineBlocks();

  // 3) Rails & Stations
  drawRails();
  drawStations();

  // 4) Car Animation
  advanceCars();
  drawCars();

  pop();
  pop();
}


// Adjustment
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
