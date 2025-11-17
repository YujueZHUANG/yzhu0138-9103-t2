// Style 
let mondrianYellow = "#F2D10D";
let mondrianRed = "#C43B31";
let mondrianBlue = "#2E66B3";
let mondrianWhite = "#FBFAF8";
let palette = [mondrianBlue, mondrianRed, mondrianWhite];
let townLineW = 5;

// Town Outline
const townOutline = [
  { x: 62, y: 100 },
  { x: 310, y: 100 },
  { x: 360, y: 200 },
  { x: 360, y: 287 },
  { x: 255, y: 287 },
  { x: 165, y: 200 },
  { x: 100, y: 200 },
  { x: 62, y: 180 },
  { x: 62, y: 100 }
];

function drawTownOutline() {
  stroke(mondrianYellow);
  strokeWeight(townLineW);
  noFill();

  for (let i = 0; i < townOutline.length - 1; i++) {
    let a = townOutline[i];
    let b = townOutline[i + 1];
    line(a.x, a.y, b.x, b.y);
  }
}

// lines inside the town
let townGridXs = [];
let townGridYs = [];

function initTownGrid() {
  let numX = int(random(3, 5));
  townGridXs = [];
  for (let i = 0; i < numX; i++) {
    townGridXs.push(random(100, 330) + random(-10, 10));
  }
  townGridXs.sort((a, b) => a - b);

  let numY = int(random(2, 4));
  townGridYs = [];
  for (let i = 0; i < numY; i++) {
    townGridYs.push(random(130, 250) + random(-10, 10));
  }
  townGridYs.sort((a, b) => a - b);
}

function drawTownGrid() {
  if (townGridXs.length === 0) initTownGrid();
  stroke(mondrianYellow);
  strokeWeight(townLineW);
  noFill();

  for (let x of townGridXs) {
    for (let y = 100; y < 300; y += 2) {
      if (pointInPoly(x, y, townOutline)) point(x, y);
    }
  }

  for (let y of townGridYs) {
    for (let x = 60; x < 370; x += 2) {
      if (pointInPoly(x, y, townOutline)) point(x, y);
    }
  }
}

function pointInPoly(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    let xi = poly[i].x, yi = poly[i].y;
    let xj = poly[j].x, yj = poly[j].y;
    let intersect =
      ((yi > py) !== (yj > py)) &&
      (px < ((xj - xi) * (py - yi)) / ((yj - yi) || 1e-9) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Blocks on Outline and Grid
let outlineBlocks = [];

const outlineTickAnchors = [
  { cx: 110, cy: 100, ang: 0 },
  { cx: 180, cy: 100, ang: 0 },
  { cx: 260, cy: 100, ang: 0 },
  { cx: 330, cy: 140, ang: 63.435 },
  { cx: 360, cy: 220, ang: 90 },
  { cx: 360, cy: 260, ang: 90 },
  { cx: 340, cy: 287, ang: 0 },
  { cx: 290, cy: 287, ang: 0 },
  { cx: 210, cy: 245, ang: -136.565 },
  { cx: 140, cy: 200, ang: 0 },
  { cx: 82, cy: 190, ang: -152.47 },
  { cx: 62, cy: 140, ang: 90 }
];

let outlineTickT = Math.max(1, townLineW - 2);
let outlineTickLMin = 14;
let outlineTickLMax = 28;

function initOutlineBlocks() {
  outlineBlocks = [];
  for (let a of outlineTickAnchors) {
    let L = random(outlineTickLMin, outlineTickLMax);
    let W = outlineTickT;
    let color = random(palette);
    outlineBlocks.push({ cx: a.cx, cy: a.cy, ang: a.ang, L, W, color });
  }
}

function drawOutlineBlocks() {
  if (outlineBlocks.length === 0) initOutlineBlocks();
  noStroke();
  rectMode(CENTER);
  for (let r of outlineBlocks) {
    push();
    translate(r.cx, r.cy);
    rotate(r.ang);
    fill(r.color);
    rect(0, 0, r.L, r.W);
    pop();
  }
  rectMode(CORNER);
}

// Grid Blocks
let gridBlocks = [];

function insidePolyWithMargin(cx, cy, halfW, halfH, poly) {
  let pts = [
    { x: cx, y: cy },
    { x: cx - halfW, y: cy },
    { x: cx + halfW, y: cy },
    { x: cx, y: cy - halfH },
    { x: cx, y: cy + halfH },
    { x: cx - halfW, y: cy - halfH },
    { x: cx + halfW, y: cy - halfH },
    { x: cx - halfW, y: cy + halfH },
    { x: cx + halfW, y: cy + halfH }
  ];

  for (let p of pts) {
    if (!pointInPoly(p.x, p.y, poly)) return false;
  }
  return true;
}

function initGridBlocks() {
  gridBlocks = [];

  let tickT = Math.max(1, townLineW - 2);

  // Vertical grid
  for (let x of townGridXs) {
    let k = int(random(1, 4));
    for (let i = 0; i < k; i++) {
      let cy = random(115, 285);
      let w = tickT;
      let h = random(12, 26);
      let hw = w / 2, hh = h / 2;

      if (insidePolyWithMargin(x, cy, hw, hh, townOutline)) {
        let color = palette[int(random(palette.length))];
        gridBlocks.push({ x: x - hw, y: cy - hh, w, h, color });
      }
    }
  }

  // Horizontal grid
  for (let y of townGridYs) {
    let k = int(random(1, 3));
    for (let i = 0; i < k; i++) {
      let cx = random(75, 355);
      let w = random(16, 32);
      let h = tickT;
      let hw = w / 2, hh = h / 2;

      if (insidePolyWithMargin(cx, y, hw, hh, townOutline)) {
        let color = palette[int(random(palette.length))];
        gridBlocks.push({ x: cx - hw, y: y - hh, w, h, color });
      }
    }
  }
}

function drawGridBlocks() {
  if (gridBlocks.length === 0) {
    if (townGridXs.length === 0 || townGridYs.length === 0) initTownGrid();
    initGridBlocks();
  }
  noStroke();
  for (let r of gridBlocks) {
    fill(r.color);
    rect(r.x, r.y, r.w, r.h);
  }
}

// Floating blocks in Mondrian town
class MondrianBlock {
  constructor(cx, cy, w, h, col, alpha) {
    this.baseX = cx;
    this.baseY = cy;
    this.w = w;
    this.h = h;
    this.col = col;
    this.alpha = alpha;

    // Perlin noise controls
    this.noiseLocation = random(10);
    this.noiseScale = random(0.8, 1.6);
  }
  // sample two noise values for x / y drift
  display() {
    let xNoise = noise(this.noiseLocation);
    let yNoise = noise(this.noiseLocation + 10);
    let maxOffset = 20;
    let offsetX = (xNoise - 0.5) * 2 * maxOffset * this.noiseScale;
    let offsetY = (yNoise - 0.5) * 2 * maxOffset * this.noiseScale;
    let cx = this.baseX + offsetX;
    let cy = this.baseY + offsetY;

    // apply color + alpha
    let c = color(this.col);
    c.setAlpha(this.alpha);
    fill(c);
    noStroke();

    // draw the rectangle 
    rect(cx - this.w / 2, cy - this.h / 2, this.w, this.h);

    this.noiseLocation += 0.018;
  }
}

// collection of blocks
let mondrianTown = [];

function initMondrianTown() {
  mondrianTown = [];
  let n = int(random(18, 28));
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let p of townOutline) {
    minX = min(minX, p.x);
    maxX = max(maxX, p.x);
    minY = min(minY, p.y);
    maxY = max(maxY, p.y);
  }
  const margin = 12;

  for (let i = 0; i < n; i++) {
    let colorGroup = random() < 0.6;

    let w, h, col, alpha;
    if (colorGroup) {
      w = random(15, 40);
      h = random(12, 35);
      col = random([mondrianRed, mondrianBlue]);
      alpha = 255;
    } else {
      w = random(10, 25);
      h = random(7, 22);
      col = random([mondrianYellow, mondrianWhite]);
      alpha = random(150, 200);
    }
    // pick a random center inside the town bounding box
    let cx = random(minX + margin, maxX - margin);
    let cy = random(minY + margin, maxY - margin);
    if (!insidePolyWithMargin(cx, cy, w / 2, h / 2, townOutline)) {
      i--;
      continue;
    }
    // create a new floating block instance
    mondrianTown.push(new MondrianBlock(cx, cy, w, h, col, alpha));
  }
}

function drawMondrianTown() {
  if (mondrianTown.length === 0) {
    initMondrianTown();
  }

  for (let block of mondrianTown) {
    block.display();
  }
}

// Setup draw
function setup() {
  createCanvas(420, 360);
  rectMode(CORNER);
  angleMode(DEGREES);
}

function draw() {
  background(250);
  drawTownOutline();
  drawTownGrid();
  drawGridBlocks();
  drawOutlineBlocks();
  drawMondrianTown();
}
function mousePressed() {
  initTownGrid();
  initOutlineBlocks();
  initGridBlocks();
  initMondrianTown();
}
