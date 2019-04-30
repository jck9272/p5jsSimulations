// Hypotrochoid: Wolfram MathWorld

let angle = 0;
let radius0 = 200.0; // Big circle
let numCusps = 4; // The number of cusps.
let radius = radius0 / numCusps; // Small circle.
let horzLength = 1;
let h = horzLength * radius; // If horzLength = 1, hypotrochoid becomes Hypocycloid. Further, if numCusps is an integer, hypocycloid becomes astroid.
let x0, y0, x, y; // Big circle's center and its locus
let xp, yp; // locus of a fixed point on the small circle.
let path = []; // Collection of (xp, yp).
let numAstroids; // Total number of astroids.
let count = 0; // The number of astroids drawn.
let numSizes = []; // The number of path's size.
let colors = [];
let alpha;
let line_b = true;
let circle = true;
let randomColor = false;
let symmetry = true;
let pause = true;
let cnv;
let runBtn;
let rndColChkbox;
let symChkbox;
let lineChkbox;
let lineCheckbox;
let pChkbox;
let cuspSlider;
let pCuspSlider;
let pCuspSlider0;
let pCuspSlider1;

let astroidSlider;
let pAstroidSlider;
let pAstroidSlider0;
let pAstroidSlider1;
let pAstroidSlider2;

let horzLengthSlider;
let pHorzLengthSlider;
let pHorzLengthSlider0;
let pHorzLengthSlider1;

function setup() {
  cnv = createCanvas(800, 600);
  cnv.parent('canvas');
  background(50); // To show the canvas at frameCount 0.
  gui();
}

function draw() {
  if (!pause) {
    background(50);
    numCusps = cuspSlider.value();
    radius = radius0 / numCusps;
    h = horzLength * radius;
    cuspEvent();

    translate(width / 2, height / 2);
    astroids();
    circles();
  }

  textFont('Verdana', 16);
  textAlign(LEFT);
  stroke(255, 255, 0);
  strokeWeight(1);

  if (count > 0)  {
    text('Astroid ' + count, - width / 2 + 20, - height / 2 + 30);
  }
  if (count == numAstroids) { // Stop drawing.
    end();
  }
  else {
    numAstroids = astroidSlider.value();
    horzLength = horzLengthSlider.value();
  }
}

function circles() {
  if (circle) { //For drawing circles.

    let alp = floor(map(count, 0, numAstroids, 255, 0));
    stroke(255, 255, 255, alp);
    strokeWeight(2);
    noFill();
    x = (radius0 - radius) * cos(angle);
    y = (radius0 - radius) * sin(angle);
    ellipse(0, 0, radius0 * 2, radius0 * 2);
    ellipse(x, y, radius * 2, radius * 2);
    line(x, y, xp, yp);
  }
}

function astroids() {
  // Calculate locus of astroids
  xp = (1 - 1.0 / numAstroids * (count)) * ((radius0 - radius) * cos(angle) + h * cos((radius0 - radius) / radius * angle));
  if (symmetry) {
    yp = (1 - 1.0 / numAstroids * (count)) * (radius0 - radius) * sin(angle) - h * sin((radius0 - radius) / radius * angle);
  } else {
    yp = (radius0 - radius) * sin(angle) - h * sin((radius0 - radius) / radius * angle);
  }
  path.push(new createVector(xp, yp));
  angle += 0.02;

  if (count == 0) {// The first astroid.
    if (line_b) {
      stroke(colors[0]);
      noFill();
    } else {
      //    fill(0.9 * numAstroids, 255, 0.9 * numAstroids, 50);
      fill(colors[0]);
      noStroke();
    }
    beginShape();
    for (let i = 0; i < path.length; i++) {
      let v = path[i];
      vertex(v.x, v.y);
    }
    endShape();
  } else {
    let weight = 0;
    for (let j = 0; j < count; j++) { // Existing astroids.
      weight = floor(map(j, 0, 0.9 * numAstroids, 0, 255));
      beginShape();
      if (line_b) {
        //stroke(weight, 255, weight);
        stroke(colors[j]);
        noFill();
      } else {
        //fill(weight, 255, weight, 50);
        fill(colors[j]);
        noStroke();
      }
      //Draw curent astroid
      for (let i = numSizes[j]; i < numSizes[j + 1]; i++) {
        let v = path[i];
        vertex(v.x, v.y);
      }
      endShape();
    }
    if (count < numAstroids) {
      beginShape(); // Current astroid.
      weight = floor(map(count, 0, 0.9 * numAstroids, 0, 255));
      if (line_b) {
        //stroke(weight, 255, weight);
        stroke(colors[count]);
      } else {
        //fill(weight, 255, weight, 50);
        fill(colors[count]);
      }
      for (let i = numSizes[count]; i < path.length; i++) {
        let v = path[i];
        vertex(v.x, v.y);
      }
      endShape();
    }
  }

  if (angle > TWO_PI) { // When creation of an astroid is done, do the next one.
    count++;
    if (count < numAstroids) {
      numSizes[count] = path.length;
    }
    angle = 0;
  }
}

function end() {
  text("Done!", -width / 2 + 20, -height /2 + 50);
  symChkbox.attribute("disabled", "true");
  lineChkbox.attribute("disabled", "true");
  cuspSlider.attribute("disabled", "true");
  runBtn.attribute("disabled", "true");
  noLoop();
}

function gui() {
  symChkbox = createCheckbox('symmetry', true);
  symChkbox.parent('checkboxes');
  symChkbox.changed(symEvent);

  lineChkbox = createCheckbox('line', true);
  lineChkbox.parent('checkboxes');
  lineChkbox.position(symChkbox.position().x + 100, symChkbox.position().y);
  lineChkbox.changed(lineEvent);

  rndColChkbox = createCheckbox('random color', false);
  rndColChkbox.parent('checkboxes');
  rndColChkbox.position(symChkbox.position().x + 150, symChkbox.position().y);
  rndColChkbox.changed(rndEvent);

  cuspSlider = createSlider(2, 16, 4);
  cuspSlider.parent('sliders');
  let x = cuspSlider.position(). x;
  let y = cuspSlider.position(). y;
  cuspSlider.position(x + 10, y);
  cuspSlider.changed(cuspEvent);

  pCuspSlider = createP('no. cusps: 4');
  pCuspSlider.class('number1');
  pCuspSlider.parent('sliders');
  pCuspSlider.position(x + 10  , y + 20);
  pCuspSlider0 = createP('2');
  pCuspSlider0.parent('sliders');
  pCuspSlider0.class("number");
  pCuspSlider0.position(cuspSlider.position().x - 12, cuspSlider.position().y - 18);
  pCuspSlider1 = createP('16');
  pCuspSlider1.parent('sliders');
  pCuspSlider1.class("number");
  pCuspSlider1.position(cuspSlider.position().x + cuspSlider.width + 3, cuspSlider.position().y - 18);

  astroidSlider = createSlider(1, 60, 20);
  astroidSlider.parent('sliders');
  astroidSlider.position(x + 200, y);
  astroidSlider.changed(astroidEvent);
  pAstroidSlider = createP('no. astroids: 20');
  pAstroidSlider.class('number1');
  pAstroidSlider.parent('sliders');
  pAstroidSlider.position(astroidSlider.position().x, astroidSlider.position().y + 20);
  pAstroidSlider0 = createP('1');
  pAstroidSlider0.parent('sliders');
  pAstroidSlider0.class("number");
  pAstroidSlider0.position(astroidSlider.position().x - 12, astroidSlider.position().y - 18);
  pAstroidSlider1 = createP('60');
  pAstroidSlider1.parent('sliders');
  pAstroidSlider1.class("number");
  pAstroidSlider1.position(astroidSlider.position().x + astroidSlider.width + 3, astroidSlider.position().y - 18);

  horzLengthSlider = createSlider(0.5, 2, 1, 0.5);
  horzLengthSlider.parent('sliders');
  horzLengthSlider.position(x + 400, y);
  horzLengthSlider.changed(horzLengthEvent);

  pHorzLengthSlider = createP('horizontal length: 1');
  pHorzLengthSlider.class('number1');
  pHorzLengthSlider.parent('sliders');
  pHorzLengthSlider.position(horzLengthSlider.position().x , horzLengthSlider.position().y + 20);
  pHorzLengthSlider0 = createP('0.5');
  pHorzLengthSlider0.parent('sliders');
  pHorzLengthSlider0.class("number");
  pHorzLengthSlider0.position(horzLengthSlider.position().x - 23, horzLengthSlider.position().y - 18);
  pHorzLengthSlider1 = createP('2');
  pHorzLengthSlider1.parent('sliders');
  pHorzLengthSlider1.class("number");
  pHorzLengthSlider1.position(horzLengthSlider.position().x + horzLengthSlider.width + 3, horzLengthSlider.position().y - 18);

  runBtn = createButton("run");
  runBtn.parent('buttons');
  runBtn.mousePressed(start);
}

function rndEvent() {
  if (rndColChkbox.checked()) {
    randomColor = true;
  } else {
    randomColor = false;
  }
}

function symEvent() {
  if (symChkbox.checked()) {
    symmetry = true;
  } else {
    symmetry = false;
  }
}

function lineEvent() {
  if (this.checked()) {
    line_b = true;
  } else {
    line_b = false;
  }
  setAlpha();
}

function cuspEvent() {
  pCuspSlider.html('no. cusps: ' + cuspSlider.value());
}

function astroidEvent() {
  pAstroidSlider.html('no. astroids: ' + astroidSlider.value());
  for (let i = 0; i < astroidSlider.value(); i++) {
    let c = color(floor(random(255), floor(random(255)), floor(random(255))));
    colors.push(c);
  }
}

function horzLengthEvent() {
  pHorzLengthSlider.html('horizontal length: ' + horzLengthSlider.value());
}

function start() {
  pause = false;
  circle = true;
  setColors();
  runBtn.attribute("disabled", true);
  astroidSlider.attribute("disabled", true);
  horzLengthSlider.attribute("disabled", true);
  rndColChkbox.attribute("disabled", true);
  path = [];
  numSizes = [];
  count = 0;
  angle = 0;
  numSizes[0] = 0;
}

function keyPressed() {
  if (key == 'R') {//restart
    start(); 
  }
  else if (key == 'P') { // pause/resume
    pause = !pause;
  }
  else if (key == 'C') {
    circle = !circle;
  }
}

function setColors() {
  let col;
  colors = [];
  let x = floor(random(255));
  for (let i = 0; i < numAstroids; i++) {
    let weight = floor(map(i, 0, numAstroids - 1, 0, 255));
    if (!randomColor) {
      col = color(weight, 255, weight);
    }
    else {
      let rv = random(1);
      if (rv < 1 / 3.0) {
        col = color(weight, 255, weight);
      } else if ( rv < 2 / 3.0) {
        col = color(255, weight, weight);
      } else {
        col = color(weight, weight, 255);
      }
    }
    colors.push(col);
  }
}

function setAlpha() {
  for (let col of colors) {
    if (line_b) {
      col.setAlpha(255);
    } else {
      col.setAlpha(50);
    }
  }
}
