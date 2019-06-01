// canvas
let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

console.log("heihei, du");

// HTML elements
let coefficient = document.getElementById("coefficient");
let speed = document.getElementById("speed");
let sinRadio = document.getElementById("sin");
let cosRadio = document.getElementById("cos");

// canvas variables
let h = window.innerHeight - 60;
let w = window.innerWidth;

const radius = h / 6.3;
let currentTrigFunction = "sin";
let trigFunction = (i, currentAngle, invert) => {
  if (
    (currentTrigFunction === "sin" && !invert) ||
    (currentTrigFunction === "cos" && invert)
  ) {
    return Math.sin(currentAngle * i * Math.PI);
  } else if (
    (currentTrigFunction === "cos" && !invert) ||
    (currentTrigFunction === "sin" && invert)
  ) {
    return Math.cos(currentAngle * i * Math.PI);
  }
};

let pi_mult = 4;
let angle = 0;
let points = [];
let alternating = false;

function render() {
  ctx.clearRect(0, 0, w, h);

  setParameters();

  ctx.save();
  ctx.translate(450, h / 2);

  let x = 0;
  let y = 0;
  let it_radius = 0;

  let tracked_y = 0;
  let tracked_x = 0;

  let steps = 0;
  let denominator = 0;

  for (let i = 1; i < coefficient.value; i = i + 2) {
    steps++;

    if (alternating && steps % 2 === 0) {
      denominator = i;
    } else {
      denominator = -i;
    }

    x =
      radius *
      (pi_mult / (denominator * Math.PI)) *
      trigFunction(i, angle, true);
    y =
      radius *
      (pi_mult / (denominator * Math.PI)) *
      trigFunction(i, angle, false);
    it_radius = radius * (pi_mult / (i * Math.PI));

    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.arc(0, 0, it_radius, 0, 2 * Math.PI);

    ctx.moveTo(0, 0);
    ctx.lineTo(x, y);

    tracked_y += y;
    tracked_x += x;

    ctx.translate(x, y);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.arc(0, 0, 2, 0, 2 * Math.PI);
  ctx.fill();
  points.unshift(tracked_y);

  ctx.restore();
  ctx.save();
  ctx.translate(650, h / 2);

  let prev_x = tracked_x - 200;
  let prev_y = tracked_y;

  ctx.lineJoin = "round";

  for (let j = 0; j < points.length; j++) {
    ctx.strokeStyle = "red";
    ctx.moveTo(prev_x, prev_y);
    ctx.lineTo(j + 300, points[j]);
    prev_x = j + 300;
    prev_y = points[j];
  }

  ctx.stroke();

  if (points.length > 1200) {
    points.pop();
  }

  ctx.restore();

  angle = angle - speed.value / 10000;

  window.requestAnimationFrame(render);
}

function setParameters() {
  let trig = document.querySelector('input[name="sincospicker"]:checked').value;

  if (trig === "sin") {
    currentTrigFunction = "sin";
  } else if (trig === "cos") {
    currentTrigFunction = "cos";
  }

  alternating = document.getElementById("minus").checked;
}

function init() {
  c.width = w;
  c.height = h;
  render();
}

init();
