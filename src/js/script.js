// ================= FIREWORK HYBRID =================
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ===== CONFIG =====
const colors = ["#ff0043", "#14fc56", "#1e90ff", "#ffae00", "#ffffff"];
let rockets = [];
let particles = [];
let currentRockets = 0;
const MAX_ROCKETS = 7;

// ================= ROCKET =================
class Rocket {
  constructor(x, targetY, color, angleX = 0) {
    this.x = x;
    this.y = canvas.height;
    this.color = color;
    this.targetY = targetY;

    this.velocity = {
      x: angleX,
      y: -12.5 - Math.random() * 2.5,
    };

    this.gravity = 0.105;
    this.friction = 0.995;

    this.trail = [];
    this.trailLength = 7;
    while (this.trailLength--) this.trail.push([this.x, this.y]);
  }

  update(index) {
    this.trail.pop();
    this.trail.unshift([this.x, this.y]);

    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.velocity.y += this.gravity;

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.y <= this.targetY || this.velocity.y >= 0) {
      explode(this.x, this.y, this.color);
      rockets.splice(index, 1);
      currentRockets--;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(
      this.trail[this.trail.length - 1][0],
      this.trail[this.trail.length - 1][1]
    );
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }
}



// ================= PARTICLE =================
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;

    this.trail = [];
    this.trailLength = 5;
    while (this.trailLength--) this.trail.push([this.x, this.y]);

    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 7 + 2;
    this.friction = 0.96;
    this.gravity = 0.7;

    this.alpha = 1;
    this.decay = Math.random() * 0.012 + 0.008;
  }

  update(index) {
    this.trail.pop();
    this.trail.unshift([this.x, this.y]);

    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;

    this.alpha -= this.decay;
    if (this.alpha <= 0) particles.splice(index, 1);
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(
      this.trail[this.trail.length - 1][0],
      this.trail[this.trail.length - 1][1]
    );
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsla(${Math.random()*360},100%,60%,${this.alpha})`;
    ctx.stroke();
  }
}

// ================= EXPLODE =================
function explode(x, y, color) {
  // Flash sáng trung tâm
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const g = ctx.createRadialGradient(x, y, 0, x, y, 80);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.2, color);
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Particle dày như A
  let count = 120;
  while (count--) {
    particles.push(new Particle(x, y, color));
  }
}


// ================= LAUNCH =================
function launch(angleX = 0) {
  if (currentRockets >= MAX_ROCKETS) return;
  currentRockets++;

  const centerX = canvas.width / 2;   // 1 điểm duy nhất
  const targetY = Math.random() * canvas.height * 0.1;
  const color = colors[Math.floor(Math.random() * colors.length)];

  rockets.push(new Rocket(centerX, targetY, color, angleX));
}



// ================= ANIMATE =================
function animate() {
  requestAnimationFrame(animate);

  // fade trail (ánh sáng A)
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0,0,0,0.06)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // glow blend A
  ctx.globalCompositeOperation = "lighter";

for (let i = rockets.length - 1; i >= 0; i--) {
  const r = rockets[i];
  if (!r || typeof r.draw !== "function") {
    rockets.splice(i, 1);
    continue;
  }
  r.draw();
  r.update(i);
}


  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].draw();
    particles[i].update(i);
  }

}
animate();

// ================= AUTO =================
let round = 0;
// setInterval(() => {
//   round++;
//   if (round % 6 === 0) {
//     for (let i = 0; i < 18; i++) setTimeout(launch, i * 70);
//   } else {
//     launch();
//   }
// }, 1300);

// ================= CLICK =================
// ================= HElPER =================

function fireSpread(delay = false) {
  const base = [0, -3.2, 3.2, -5.2, 5.2, -7.2, 7.2, -9.2, 9.2];

  // 30% bắn thêm 2 tia
  if (Math.random() < 0.3) {
    base.push(-3.6, 3.6);
  }

  base.forEach((a, i) => {
    if (delay) setTimeout(() => launch(a), i * 70);
    else launch(a);
  });
}



document.getElementById("launchBtn").addEventListener("click", () => {
    fireSpread(Math.random() > 0.5); 
    launch(0);// giữaQ
    launch(-3.2);// trái nhẹ
    launch(3.2);// phải nhẹ
    launch(-5.4);// trái xa
    launch(5.4);// phải xa
    launch(-7.4);// trái xa
    launch(7.4);// phải xa
    launch(-10.4);// trái xa
    launch(10.4);// phải xa
});




