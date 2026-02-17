// ================= FIREWORK HYBRID =================
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
      y: -12.5 - Math.random() * 3.2,
    };

    this.gravity = 0.105;
    this.friction = 0.995;

    this.trail = [];
    this.trailLength = 5;
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
      this.trail[this.trail.length - 1][1],
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
      this.trail[this.trail.length - 1][1],
    );
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsla(${Math.random() * 360},100%,60%,${this.alpha})`;
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

  const centerX = canvas.width / 2; // 1 điểm duy nhất
  const targetY = Math.random() * canvas.height * 0.1;
  const color = colors[Math.floor(Math.random() * colors.length)];

  rockets.push(new Rocket(centerX, targetY, color, angleX));
}

// ================= ANIMATE =================
function animate() {
  requestAnimationFrame(animate);

  // fade trail (ánh sáng A)
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0,0,0,0.32)";
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

// ================= LỜI CHÚC & MẪU TÂM THƯ THEO LOẠI NGƯỜI NHẬN =====

const letterGreetings = {
  "ong-ba": [
    "Kính chúc Ông Bà",
    "Thưa Ông Bà kính yêu",
    "Thưa Ông Bà thân kính",
    "Cháu kính gửi Ông Bà",
  ],
  "bo-me": [
    "Kính chúc Bố Mẹ",
    "Thương yêu Bố Mẹ",
    "Kính chúc Cha Mẹ",
    "Con kính gửi Bố Mẹ",
  ],
  "anh-chi-em": [
    "Thân ái gửi em/anh",
    "Yêu quý",
    "Chào em thân mến",
    "Gửi anh/chị yêu quý",
  ],
  "con-cai": [
    "Thương yêu con",
    "Yêu con",
    "Kính chúc con yêu",
    "Bố/Mẹ gửi con",
  ],
  "ban-be": [
    "Thân mến bạn",
    "Tri kỷ của mình",
    "Bạn thân yêu quý",
    "Gửi bạn yêu",
  ],
  "dong-nghiep": [
    "Trân trọng",
    "Cộng sự thân mến",
    "Đồng hành cùng bạn",
    "Gửi đồng nghiệp",
  ],
  "thay-co": [
    "Kính chúc Thầy/Cô",
    "Thưa Thầy/Cô kính mến",
    "Thưa Thầy/Cô thân kính",
    "Học trò kính gửi Thầy/Cô",
  ],
  "nguoi-thuong": [
    "Yêu thương em/anh",
    "Riêng dành cho em",
    "Tặng người yêu",
    "Gửi em/anh yêu dấu",
  ],
};

const letterBlessings = {
  "ong-ba": [
    // Sức khỏe
    "Cháu chúc Ông Bà luôn dồi dào sức khỏe, tinh thần minh mẫn, tuổi thọ như Tùng Ngoại, Hạc Thọ Nam Sơn. Mong Ông Bà luôn khỏe mạnh để chứng kiến con cháu lớn lên, gia đình sum họp đầm ấm.",

    "Năm mới xin chúc Ông Bà sức khỏe dồi dào, bình an vui vẻ bên đông con cháu. Mỗi ngày đều tràn đầy niềm vui, sống lâu sống khỏe để cùng gia đình đón thêm nhiều mùa Xuân.",

    "Chúc Ông Bà năm mới luôn khỏe mạnh, hạnh phúc viên mãn. Mọi điều tốt đẹp nhất đến với Ông Bà, tuổi thọ miên trường, phúc lộc song toàn, con cháu hiếu thảo đầy nhà.",

    // Hạnh phúc gia đình
    "Cháu kính chúc Ông Bà một năm mới an khang thịnh vượng, phúc thọ miên trường. Gia đình luôn sum vầy, con cháu hiếu thảo, cuộc sống bình yên và trọn vẹn.",

    "Năm mới xin kính chúc Ông Bà luôn thanh thái, vui vẻ. Được hưởng vinh hoa phú quý, con cháu nối dài, tứ đại đồng đường, hạnh phúc trọn đời.",
  ],

  "bo-me": [
    // Sức khỏe & Sự nghiệp
    "Con chúc Bố Mẹ năm mới dồi dào sức khỏe, công việc thuận lợi, sự nghiệp thăng hoa. Mọi dự định đều thành công, gia đình luôn ấm êm, hạnh phúc trọn vẹn.",

    "Chúc Bố Mẹ năm mới an khang thịnh vượng, vạn sự như ý. Luôn khỏe mạnh, tươi trẻ, tràn đầy năng lượng. Công việc phát triển, tài lộc đầy túi, con cái noi gương học tập.",

    "Con kính chúc Cha Mẹ năm mới bình an, hạnh phúc. Sức khỏe dồi dào, công danh viên mãn, tài lộc sung túc. Gia đình luôn sum họp, yên vui, được con hiếu kính.",

    // Hạnh phúc gia đình
    "Năm mới con chúc Bố Mẹ luôn vui khỏe, hạnh phúc bên nhau. Mọi điều tốt đẹp đều đến, công việc thuận buồm xuôi gió, gia đình ấm áp, con cái ngoan ngoãn.",

    "Chúc Bố Mẹ năm mới tràn đầy niềm vui, sức khỏe bền lâu. Công danh thành đạt, gia đạo sum vầy, phúc lộc đầy nhà, tuổi già thanh thái an nhàn.",
  ],

  "anh-chi-em": [
    // Sự nghiệp
    "Chúc em/anh năm mới sự nghiệp thăng tiến, công việc hanh thông. Mọi mục tiêu đều đạt được, dự án nào cũng thành công, tài chính dồi dào, cuộc sống viên mãn.",

    "Năm mới chúc em/anh luôn khỏe mạnh, hạnh phúc. Sự nghiệp vươn cao, thành công rực rỡ, tình cảm gia đình thắm thiết, mọi điều tốt đẹp đều đến.",

    // Tình cảm & Gia đình
    "Chúc anh/chị năm mới an khang thịnh vượng, vạn sự như ý. Công danh viên mãn, tình duyên thuận lợi, gia đình hạnh phúc, con cái ngoan ngoãn học giỏi.",

    "Năm mới mong em/anh luôn vui vẻ, khỏe mạnh. Công việc thuận lợi, tài lộc dồi dào, tình yêu ngọt ngào, gia đình ấm áp sum vầy.",

    "Chúc em/anh năm mới tràn đầy năng lượng, thành công trong mọi việc. Sự nghiệp phát triển vượt bậc, tình cảm bền chặt, cuộc sống ngày càng tốt đẹp.",
  ],

  "con-cai": [
    // Học tập
    "Con yêu, bố/mẹ chúc con năm mới khôn lớn, học giỏi. Mỗi ngày đều tiến bộ, luôn vui vẻ, ngoan ngoãn. Lớn lên thành người có ích, tương lai rạng rỡ, thành công rực rỡ.",

    "Chúc con năm mới luôn khỏe mạnh, học tập tốt. Yêu lầy đọc sách, ham học hỏi, thành tích cao, bạn bè quý mến, thầy cô yêu thương.",

    // Tương lai
    "Con yêu, năm mới bố/mẹ chúc con luôn vui cười, bình an. Lớn lên ngoan ngoãn, học giỏi chơi khỏe. Trở thành người tài giỏi, hiếu thảo, làm cha mẹ tự hào.",

    "Chúc con năm mới mạnh khỏe, thông minh. Mỗi ngày đều học được điều mới, nuôi dưỡng ước mơ lớn, lớn lên thành người ưu tú, hạnh phúc trọn đời.",

    "Con yêu quý, chúc con năm mới tràn đầy niềm vui. Luôn được yêu thương, chở che, học hành tốt, sức khỏe dồi dào, tương lai xán lạn.",
  ],

  "ban-be": [
    // Tình bạn
    "Chúc bạn năm mới sự nghiệp thành công, tình bạn bền chặt. Chúng ta luôn là tri kỷ, cùng nhau vượt mọi khó khăn, chia sẻ niềm vui, mãi mãi bên nhau.",

    "Năm mới chúc bạn thân luôn khỏe mạnh, hạnh phúc. Công việc thuận lợi, tài lộc dồi dào, tình bạn của chúng ta ngàn năm không đổi, luôn đồng hành cùng nhau.",

    // Thành công
    "Chúc bạn năm mới vạn sự như ý, mọi điều tốt đẹp. Cùng nhau lên đỉnh, đạt được ước mơ, tình bạn vĩnh cửu, hạnh phúc viên mãn.",

    "Năm mới chúc bạn yêu luôn tươi trẻ, năng động. Sự nghiệp thăng tiến, tình yêu ngọt ngào, tình bạn thắm thiết, cuộc sống tràn đầy màu sắc.",

    "Chúc bạn thân năm mới thành công rực rỡ, hạnh phúc ngập tràn. Chúng ta mãi là tuổi trẻ, mãi là tri kỷ, cùng nhau tạo nên những kỷ niệm đẹp.",
  ],

  "dong-nghiep": [
    // Công việc
    "Chúc đồng nghiệp năm mới sự nghiệp thăng tiến, công việc thuận lợi. Mọi dự án đều thành công, mục tiêu nào cũng đạt được, thu nhập tăng cao, thăng chức sớm.",

    "Năm mới chúc bạn luôn khỏe mạnh, năng động. Công việc hanh thông, cơ hội mới đến liên tục, sự nghiệp phát triển vượt bậc, đời sống sung túc.",

    // Hợp tác
    "Chúc cộng sự năm mới vạn sự như ý, thành công viên mãn. Chúng ta tiếp tục đồng hành, cùng nhau xây dựng, tạo nên thành tựu vượt trội.",

    "Năm mới chúc đồng nghiệp luôn tràn đầy nhiệt huyết, sáng tạo. Công việc thuận buồm xuôi gió, thăng tiến nhanh chóng, cuộc sống ngày càng tốt đẹp.",

    "Chúc bạn năm mới năng lượng dồi dào, thành công rực rỡ. Chung tay xây dựng, cùng nhau phát triển, đạt được mục tiêu cao nhất.",
  ],

  "thay-co": [
    // Sức khỏe & Sự nghiệp
    "Kính chúc Thầy/Cô năm mới sức khỏe dồi dào, công tác thuận lợi. Lâu năm dạy dỗ, sớm hưởng thụ tuổi già thanh thái. Học trò luôn kính mến, biết ơn công lao dạy dỗ.",

    "Năm mới kính chúc Thầy/Cô luôn khỏe mạnh, hạnh phúc. Công việc giảng dạy hiệu quả, học sinh ngoan ngoãn học giỏi, được nhà trường trọng dụng, gia đình ấm áp.",

    "Kính chúc Thầy/Cô năm mới tràn đầy năng lượng, nhiệt huyết. Nghiêm túc mà vui vẻ, công tác thuận lợi, thế hệ học trò nối tiếp, tôn sư trọng đạo.",

    // Tri ân
    "Em kính chúc Thầy/Cô năm mới bình an, hạnh phúc. Sức khỏe dồi dào, sự nghiệp giáo dục thành công rực rỡ. Mãi mãi là ngọn đuốc soi đường cho học trò.",

    "Kính chúc Thầy/Cô năm mới vạn sự như ý, phúc lộc đầy nhà. Công lao dạy dỗ muôn đời, học trò luôn ghi nhớ, kính trọng, biết ơn sâu sắc.",
  ],

  "nguoi-thuong": [
    // Tình yêu
    "Em/Anh yêu, chúc chúng ta năm mới yêu thương trọn đời, bên nhau mãi mãi. Hạnh phúc viên mãn, chia sẻ mọi niềm vui nỗi buồn, cùng nhau vượt mọi khó khăn.",

    "Năm mới chúc em/anh luôn khỏe mạnh, xinh đẹp/đẹp trai hơn. Tình yêu của chúng ta ngàn năm không đổi, bình an đến cuối đời, hạnh phúc ngập tràn.",

    "Chúc em/anh yêu năm mới rực rỡ, tình yêu ngọt ngào. Chúng ta luôn bên nhau, nắm tay nhau đi suốt cuộc đời, viết nên câu chuyện tình yêu đẹp nhất.",

    // Hạnh phúc chung
    "Em/Anh thương yêu, chúc chúng ta năm mới ấm áp, hạnh phúc. Công việc thuận lợi, tài chính dồi dào, tình yêu bền vững, gia đình sum vầy.",

    "Năm mới chúc người yêu của anh/em luôn vui cười, khỏe mạnh. Chúng ta sẽ cùng nhau xây dựng tổ ấm, nuôi dưỡng ước mơ, sống hạnh phúc trọn đời.",
  ],
};

const letterIntros = {
  "ong-ba": ["một năm mới", "năm nay", "hôm nay cháu xin chúc"],
  "bo-me": ["một năm mới", "năm nay", "những ngày tháng sắp tới"],
  "anh-chi-em": ["một năm mới", "năm này", "những ngày tới"],
  "con-cai": ["một năm mới", "tuổi con", "những ngày sắp tới"],
  "ban-be": ["một năm mới", "năm này", "những ngày tới"],
  "dong-nghiep": ["một năm mới", "năm nay", "thời gian tới"],
  "thay-co": ["một năm mới", "năm nay", "những ngày tới"],
  "nguoi-thuong": ["một năm mới", "những ngày tới", "suốt cuộc đời"],
};

const letterClosings = {
  "ong-ba": ["Cháu kính chúc", "Cháu chúc", "Với tình yêu từ cháu"],
  "bo-me": ["Con chúc mừng", "Với tình yêu từ con", "Con xin kính chúc"],
  "anh-chi-em": ["Từ em/anh", "Với tình thân anh chị em", "Yêu quý"],
  "con-cai": ["Từ bố/mẹ yêu thương", "Với tình yêu vô hạn", "Luôn ở bên con"],
  "ban-be": ["Từ bạn thân", "Tri kỷ gửi gắm", "Của bạn"],
  "dong-nghiep": ["Cộng sự thân", "Đồng hành cùng bạn", "Trân trọng gửi"],
  "thay-co": ["Từ học trò", "Học trò kính gửi", "Cảm ơn và chúc mừng"],
  "nguoi-thuong": [
    "Yêu thương em/anh",
    "Từ trái tim",
    "Chỉ dành riêng cho em/anh",
  ],
};

// Hàm random lời chúc theo loại người nhận
function getRandomLetterContent(recipientKey) {
  const greeting = letterGreetings[recipientKey]
    ? letterGreetings[recipientKey][
        Math.floor(Math.random() * letterGreetings[recipientKey].length)
      ]
    : "Chúc mừng";

  const blessing = letterBlessings[recipientKey]
    ? letterBlessings[recipientKey][
        Math.floor(Math.random() * letterBlessings[recipientKey].length)
      ]
    : "tràn đầy hạnh phúc";

  const closing = letterClosings[recipientKey]
    ? letterClosings[recipientKey][
        Math.floor(Math.random() * letterClosings[recipientKey].length)
      ]
    : "Trân trọng";

  return {
    greeting,
    blessing,
    closing,
    fullText: `${greeting},\n\n${blessing}\n\n${closing}!`,
  };
}

// ================= END LỜI CHÚC & MẪU TÂM THƯ =====

// ================= CLICK - ĐIỀU CHỈNH CHO MOBILE =================
// ================= HELPER =================

function fireSpread(delay = false) {
  // Điều chỉnh góc bắn dựa trên kích thước màn hình
  const isMobile = window.innerWidth < 768;
  const scale = isMobile ? 0.4 : 1; // Giảm 60% góc bắn trên mobile

  const base = [
    0,
    -3.2 * scale,
    3.2 * scale,
    -5.2 * scale,
    5.2 * scale,
    -7.2 * scale,
    7.2 * scale,
    -9.2 * scale,
    9.2 * scale,
  ];

  // 30% bắn thêm 2 tia
  if (Math.random() < 0.3) {
    base.push(-3.6 * scale, 3.6 * scale);
  }

  base.forEach((a, i) => {
    if (delay) setTimeout(() => launch(a), i * 70);
    else launch(a);
  });
}

document.getElementById("launchBtn").addEventListener("click", () => {
  // Điều chỉnh góc bắn dựa trên kích thước màn hình
  const isMobile = window.innerWidth < 768;
  const scale = isMobile ? 0.4 : 1; // Giảm 60% góc bắn trên mobile

  const sequence = [
    0,
    -3.2 * scale,
    3.2 * scale,
    -5.4 * scale,
    5.4 * scale,
    -7.4 * scale,
    7.4 * scale,
    -10.4 * scale,
    10.4 * scale,
  ];

  sequence.forEach((angle, i) => {
    setTimeout(() => {
      launch(angle);
    }, i * 220); // <<< khoảng cách giữa mỗi lần bắn (ms)
  });
});

// ================= CÁNH MAI RƠI =================
(function petalInit() {
  const layer = document.getElementById("petal-layer");
  if (!layer) return;

  function makePetalSVG(uid) {
    const colors = [
      { base: "#ffd700", light: "#fff6b0" },
      { base: "#ffcc00", light: "#ffe680" },
      { base: "#ffdb58", light: "#fff1a0" },
      { base: "#ffe135", light: "#fff3a5" },
    ];
    const colorSet = colors[uid % colors.length];

    const shapes = [
      `M12,5 Q20,10 20,20 Q12,15 5,20 Q5,10 12,5Z`,
      `M20,6 Q25,13 20,20 Q15,13 20,6Z`,
      `M20,8 Q23,13 20,18 Q17,13 20,8Z`,
      `M12,3 Q20,12 12,22 Q5,12 12,3Z`,
    ];

    const shape = shapes[uid % shapes.length];

    return `
    <svg viewBox="0 0 40 25">
      <defs>
        <radialGradient id="g${uid}">
          <stop offset="0%" stop-color="${colorSet.light}"/>
          <stop offset="100%" stop-color="${colorSet.base}"/>
        </radialGradient>
      </defs>
      <path d="${shape}" fill="url(#g${uid})"/>
    </svg>`;
  }

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  let uid = 0;

  function spawnPetal() {
    uid++;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const w = rand(18, 30);
    const x = rand(0, vw);
    const y = rand(-40, -10);

    const wrap = document.createElement("div");
    wrap.className = "petal-wrap";
    wrap.style.cssText = `
      left:${x}px;
      top:${y}px;
      width:${w}px;
      height:${w * 0.9}px;
      filter:drop-shadow(0 4px 6px rgba(255,215,0,0.3));
      animation:petalFloatAndDrift ${rand(14, 22)}s linear forwards;
      --drift-x-early:${rand(-60, 60)}px;
      --drift-x-mid:${rand(-80, 80)}px;
      --drift-x-late:${rand(-60, 60)}px;
      --drift-x-final:${rand(-40, 40)}px;
      --drift-x-end:${rand(-30, 30)}px;
      --drift-x-pull:${rand(-20, 20)}px;
    `;

    const spin = document.createElement("div");
    spin.style.cssText = `
      width:100%;
      height:100%;
      animation:
        petalGentleSway ${rand(4, 7)}s ease-in-out infinite,
        petalGentleRotate ${rand(12, 20)}s linear infinite;
    `;

    spin.innerHTML = makePetalSVG(uid);
    wrap.appendChild(spin);
    layer.appendChild(wrap);

    setTimeout(() => wrap.remove(), 26000);
  }

  function loop() {
    const count = Math.random() < 0.5 ? 1 : 2;
    for (let i = 0; i < count; i++) {
      setTimeout(spawnPetal, i * 300);
    }
    setTimeout(loop, rand(1600, 2200));
  }

  /* Spawn ngay khi load */
  for (let i = 0; i < 4; i++) spawnPetal();

  loop();
})();
