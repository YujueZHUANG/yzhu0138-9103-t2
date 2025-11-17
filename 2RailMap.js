// Rail Map — Drawing functions for the map rendering.

/*
 Render Order of Layers
 drawSea() — Background panels and small masks.
 drawRails() — Polylines for each route.
 drawStations() — Final station dots placed on the lines.
 drawPolyline() — Helper that connects point arrays with lines.
*/


// Original Size
const original_W = 600;
const original_H = 500;

// Style
let stroke_W = 2;
let dot_R = 6;
//sea


// Colors
let c_Base = "#FBFAF8";


let c_M1 = "#80FFF7";
let c_T5 = "#FF007F";
let c_T1 = "#FFAE42";
let c_T2 = "#00788D";
let c_T3 = "#FF8000";
let c_T8 = "#008000";
let c_T4 = "#0047AB";
let c_T9 = "#ED1C24";
let c_T6 = "#4D3900";
let c_T7 = "#808080";
let c_Pink = "#FFB6C1";
let c_Gray = "#D3D3D3";


// Path Data
const p_M1 = [
  { x: 100, y: 150 }, { x: 293, y: 150 }, { x: 293, y: 170 }, { x: 355, y: 170 }, { x: 370, y: 200 },
  { x: 370, y: 240 }, { x: 405, y: 240 }, { x: 405, y: 270 }, { x: 402, y: 280 }, { x: 402, y: 320 }, { x: 380, y: 340 }
];
const p_T5 = [
  { x: 50, y: 50 }, { x: 50, y: 190 }, { x: 100, y: 215 }, { x: 150, y: 215 }, { x: 190, y: 250 },
  { x: 140, y: 300 }, { x: 140, y: 400 }, { x: 60, y: 400 }
];
const p_T1 = [
  { x: 55, y: 50 }, { x: 55, y: 185 }, { x: 100, y: 210 }, { x: 155, y: 210 }, { x: 30, y: 210 }, { x: 100, y: 210 },
  { x: 155, y: 210 }, { x: 250, y: 300 }, { x: 380, y: 300 }, { x: 380, y: 200 }, { x: 300, y: 55 }, { x: 300, y: 15 }
];
const p_T2 = [
  { x: 60, y: 405 }, { x: 145, y: 405 }, { x: 145, y: 305 }, { x: 192, y: 258 }, { x: 178, y: 245 },
  { x: 192, y: 258 }, { x: 245, y: 305 }, { x: 385, y: 305 }, { x: 385, y: 220 }, { x: 430, y: 220 }, { x: 430, y: 280 }, { x: 385, y: 280 }
];
const p_T3 = [
  { x: 150, y: 380 }, { x: 150, y: 340 }, { x: 245, y: 340 }, { x: 245, y: 310 },
  { x: 390, y: 310 }, { x: 390, y: 225 }, { x: 425, y: 225 }, { x: 425, y: 275 }, { x: 390, y: 275 }
];
const p_T8 = [
  { x: 150, y: 450 }, { x: 150, y: 395 }, { x: 300, y: 395 }, { x: 395, y: 310 }, { x: 395, y: 230 },
  { x: 420, y: 230 }, { x: 420, y: 270 }, { x: 395, y: 270 }, { x: 395, y: 350 }, { x: 385, y: 360 }, { x: 340, y: 360 }
];
const p_T4_South = [
  { x: 370, y: 480 }, { x: 370, y: 338 }, { x: 400, y: 313 }, { x: 400, y: 255 }, { x: 490, y: 255 }
];
const p_T4_East = [
  { x: 370, y: 480 }, { x: 370, y: 470 }, { x: 440, y: 470 }, { x: 370, y: 470 },
  { x: 370, y: 338 }, { x: 400, y: 313 }, { x: 400, y: 255 }, { x: 490, y: 255 }
];
const p_T9 = [
  { x: 300, y: 55 }, { x: 300, y: 295 }, { x: 375, y: 295 }, { x: 375, y: 200 }, { x: 330, y: 120 }
];
const p_T7 = [
  { x: 250, y: 300 }, { x: 270, y: 280 }, { x: 270, y: 235 }
];
const p_T6 = [
  { x: 270, y: 355 }, { x: 250, y: 340 }, { x: 250, y: 312 }
];
const p_Pink = [
  { x: 270, y: 355 }, { x: 310, y: 355 }, { x: 330, y: 340 }, { x: 355, y: 340 }
];
const p_PinkWithT6 = [
  { x: 250, y: 312 }, { x: 250, y: 340 }, { x: 270, y: 355 },
  { x: 310, y: 355 }, { x: 330, y: 340 }, { x: 355, y: 340 }
];
const p_Gray = [
  { x: 165, y: 210 }, { x: 190, y: 235 }, { x: 370, y: 235 }
];
const p_WSA = [
  { x: 50, y: 380 }, { x: 50, y: 260 }, { x: 70, y: 210 }
];
const p_CityCircle = [
  { x: 390, y: 225 }, { x: 425, y: 225 }, { x: 425, y: 275 }, { x: 390, y: 275 }, { x: 390, y: 225 }
];


let c_SeaLight = "#D4E8EF";
let c_SeaDeep = "#7AAFC8";

//sea particles
let seaParticles = [];
const SEA_PARTICLE_COUNT = 1200;
const SEA_X_MIN = 490;
const SEA_X_MAX = 580;


function initSeaParticles() {
  seaParticles = [];
  for (let i = 0; i < SEA_PARTICLE_COUNT; i++) {
    seaParticles.push({
      x: random(SEA_X_MIN, SEA_X_MAX),
      y: random(0, height),
      speed: random(0.5, 1.5),
      noiseOffset: random(1000)
    });
  }
}

// sea
function drawSea() {
  noStroke();
  let steps = 100;
  //ocean color gradient
  for (let i = 0; i < steps; i++) {
    let t = i / (steps - 1);
    let col = lerpColor(color(c_SeaLight), color(c_SeaDeep), t);
    col.setAlpha(220);
    fill(col);
    let xStart = lerp(SEA_X_MIN, SEA_X_MAX, t);
    let xEnd = lerp(SEA_X_MIN, SEA_X_MAX, t + 1 / steps);
    rect(xStart, 0, xEnd - xStart, height + 400);;
  }
  fill(color(c_SeaLight + "AA"));
  beginShape();

  let stepY = 10;
  let coastAmplitude = 35;
  let coastOffset = -15;
  let tNoise = frameCount * 0.01;
  for (let y = 0; y <= height + 400; y += stepY) {
    let n = noise(y * 0.02, tNoise);
    let coastX = SEA_X_MIN + coastOffset + (n - 0.5) * 2 * coastAmplitude;
    vertex(coastX, y);
  }
  vertex(SEA_X_MAX, height + 400);
  vertex(SEA_X_MAX, 0);

  endShape(CLOSE);

  drawSeaFlow();
}

// Particles flow
function drawSeaFlow() {
  for (let p of seaParticles) {
    let depth = (p.x - SEA_X_MIN) / (SEA_X_MAX - SEA_X_MIN);
    depth = constrain(depth, 0, 1);

    let seaCol = lerpColor(color(c_SeaLight), color(c_SeaDeep), depth);
    seaCol.setAlpha(190);

    stroke(seaCol);
    strokeWeight(2);
    noFill();
    let n = noise(
      p.x * 0.006,
      p.y * 0.006,
      frameCount * 0.01 + p.noiseOffset
    );
    let angle = n * TWO_PI + PI;
    //Calculate the x / y velocity components from the angle
    let vx = cos(angle) * p.speed;
    let vy = sin(angle) * p.speed;
    let px = p.x;
    let py = p.y;

    // location update
    p.x += vx;
    p.y += vy;

    // If the particle moves outside the sea area, respawn it slightly to the left
    if (
      p.x < SEA_X_MIN - 5 ||
      p.x > SEA_X_MAX + 5 ||
      p.y < -20 ||
      p.y > height + 400
    ) {
      // 
      let seaWidth = SEA_X_MAX - SEA_X_MIN;
      p.x = random(SEA_X_MIN + 5, SEA_X_MIN + seaWidth * 1.7);
      p.y = random(0, height + 400);
      p.noiseOffset = random(1000);
      continue;
    }

    //  Only draw the line if both the previous and current positions are within the sea area (prevents lines from extending outside)
    if (
      px >= SEA_X_MIN && px <= SEA_X_MAX &&
      p.x >= SEA_X_MIN && p.x <= SEA_X_MAX
    ) {
      line(px, py, p.x, p.y);
    }
  }
}
//draw rails
function drawRails() {
  strokeWeight(stroke_W);
  noFill();
  drawPolyline(p_M1, c_M1);
  drawPolyline(p_T5, c_T5);
  drawPolyline(p_T1, c_T1);
  drawPolyline(p_T2, c_T2);
  drawPolyline(p_T3, c_T3);
  drawPolyline(p_T8, c_T8);

  drawPolyline(p_T4_South, c_T4);
  drawPolyline(p_T4_East, c_T4);

  drawPolyline(p_T9, c_T9);
  drawPolyline(p_T7, c_T7);
  drawPolyline(p_T6, c_T6);
  drawPolyline(p_Pink, c_Pink);

  drawPolyline(p_Gray, c_Gray);
  drawPolyline(p_WSA, c_Gray);
}


//  Station  positions  colours
let stations = [
  //  M1 
  { x: 100, y: 150, col: c_M1 },
  { x: 380, y: 340, col: c_M1 },

  // T5 
  { x: 50, y: 50, col: c_T5 },
  { x: 60, y: 400, col: c_T5 },

  // T1 
  { x: 55, y: 50, col: c_T1 },
  { x: 300, y: 15, col: c_T1 },
  { x: 30, y: 210, col: c_T1 },

  // T2 
  { x: 385, y: 280, col: c_T2 },
  { x: 60, y: 405, col: c_T2 },

  //  T3 
  { x: 390, y: 275, col: c_T3 },
  { x: 150, y: 380, col: c_T3 },

  // T8 
  { x: 150, y: 450, col: c_T8 },
  { x: 340, y: 360, col: c_T8 },

  //  T4 
  { x: 370, y: 480, col: c_T4 },
  { x: 440, y: 470, col: c_T4 },
  { x: 490, y: 255, col: c_T4 },

  // -T9 
  { x: 300, y: 55, col: c_T9 },
  { x: 330, y: 120, col: c_T9 },

  //  T7 
  { x: 250, y: 300, col: c_T7 },
  { x: 270, y: 235, col: c_T7 },

  //  T6 
  { x: 270, y: 355, col: c_T6 },
  { x: 250.5, y: 310, col: c_T6 },

  //  Pink 
  { x: 270, y: 355, col: c_Pink },
  { x: 355, y: 340, col: c_Pink },

  //  Gray 
  { x: 165, y: 210, col: c_Gray },
  { x: 370, y: 235, col: c_Gray },

  //  WSA 
  { x: 50, y: 380, col: c_Gray },
  { x: 70, y: 210, col: c_Gray }
];

// Draw all station locations with Perlin-noise-driven breathing halo effects
function drawStations() {
  noStroke();
  for (let s of stations) {
    drawStationWithHalo(s.x, s.y, s.col);
  }
}

//  Halo Effect
function drawStationWithHalo(x, y, col) {
  fill(col);
  noStroke();
  circle(x, y, dot_R);
  let n = noise(x * 0.05, y * 0.05, frameCount * 0.02);
  // Map n to halo radius 
  let haloR = map(n, 0, 1, dot_R * 1.5, dot_R * 4.4);
  let haloA = map(n, 0, 1, 30, 80);

  // Draw halo ring
  noFill();
  stroke(red(col), green(col), blue(col), haloA);
  strokeWeight(4);
  circle(x, y, haloR);
}


function drawPolyline(points, color) {
  if (!points || points.length < 2) return;
  stroke(color);
  for (let i = 0; i < points.length - 1; i++) {
    let a = points[i], b = points[i + 1];
    line(a.x, a.y, b.x, b.y);
  }
}
