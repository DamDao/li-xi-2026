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
        // Sức khỏe & Tuổi thọ
        "Cháu kính chúc Ông Bà năm mới dồi dào sức khỏe, tinh thần minh mẫn, tuổi thọ như Tùng Ngoại, Hạc Thọ Nam Sơn. Mong Ông Bà luôn khỏe mạnh để chứng kiến con cháu lớn lên, gia đình sum họp đầm ấm. Những năm tháng vàng son này, cháu mong Ông Bà được hưởng trọn vẹn niềm vui bên con cháu, mỗi ngày đều là những khoảnh khắc ấm áp và hạnh phúc. Sức khỏe Ông Bà là niềm vui lớn nhất của gia đình, là nguồn động viên để chúng cháu luôn cố gắng vươn lên trong cuộc sống.",
        
        "Năm mới xin kính chúc Ông Bà sức khỏe dồi dào, bình an vui vẻ bên đông con cháu. Mỗi ngày đều tràn đầy niềm vui, sống lâu sống khỏe để cùng gia đình đón thêm nhiều mùa Xuân thắm thiết. Cháu biết rằng, Ông Bà đã trải qua bao nhiêu gian khó để nuôi dưỡng con cái, dạy dỗ cháu chắt nên người. Công ơn ấy cao như núi, sâu như biển, cháu mãi mãi ghi nhớ. Mong Ông Bà luôn được an khang, thư thái, tận hưởng những năm tháng vàng son bên gia đình sum vầy.",
        
        "Chúc Ông Bà năm mới luôn khỏe mạnh, hạnh phúc viên mãn. Mọi điều tốt đẹp nhất đến với Ông Bà, tuổi thọ miên trường, phúc lộc song toàn, con cháu hiếu thảo đầy nhà. Trong những năm tháng đã qua, Ông Bà đã là chỗ dựa vững chắc cho cả gia đình, là tấm gương sáng để chúng cháu noi theo. Cháu kính chúc Ông Bà năm mới được hưởng trọn niềm vui, sống trong sự yêu thương của con cháu, mỗi ngày đều tràn đầy tiếng cười và hạnh phúc.",
        
        // Hạnh phúc gia đình
        "Cháu kính chúc Ông Bà một năm mới an khang thịnh vượng, phúc thọ miên trường. Gia đình luôn sum vầy, con cháu hiếu thảo, cuộc sống bình yên và trọn vẹn. Những lời dạy bảo của Ông Bà là kim chỉ nam cho cuộc đời cháu, giúp cháu vượt qua mọi khó khăn thử thách. Cháu mong rằng năm mới này, Ông Bà sẽ được tận hưởng những niềm vui giản dị nhất: được nhìn thấy con cháu khôn lớn, thành đạt, hiếu thảo. Đó chính là hạnh phúc lớn nhất mà cháu muốn dành tặng Ông Bà.",
        
        "Năm mới xin kính chúc Ông Bà luôn thanh thái, vui vẻ. Được hưởng vinh hoa phú quý, con cháu nối dài, tứ đại đồng đường, hạnh phúc trọn đời. Những năm tháng Ông Bà đã cống hiến cho gia đình là vô giá, những tình yêu thương mà Ông Bà dành cho con cháu là vô bờ bến. Cháu kính chúc Ông Bà sức khỏe dồi dào, luôn được vui vẻ bên con cháu, mỗi khoảnh khắc đều được sống trọn vẹn trong yêu thương và hạnh phúc.",
        
        "Kính chúc Ông Bà năm mới phúc thọ song toàn, an khang thịnh vượng. Tuổi cao đức trọng, được con cháu kính yêu, gia đình sum họp đầm ấm. Cháu biết rằng sự hiện diện của Ông Bà là niềm hạnh phúc lớn nhất của cả nhà. Những câu chuyện Ông Bà kể, những lời khuyên nhủ đều là bài học quý giá cho cuộc đời cháu. Mong Ông Bà luôn khỏe mạnh, được sống lâu để cùng gia đình tạo nên thêm nhiều kỷ niệm đẹp đẽ.",
        
        "Cháu xin chúc Ông Bà năm mới Bính Ngọ tràn đầy sức khỏe, niềm vui và may mắn. Tuổi thọ như sông dài nước chảy, hạnh phúc như biển rộng trời cao. Con cháu quây quần bên Ông Bà là cảnh tượng ấm áp nhất, là hình ảnh đẹp nhất mà cháu muốn gìn giữ. Cháu mong Ông Bà luôn vui vẻ, khỏe mạnh, được tận hưởng tuổi già an nhàn, hạnh phúc bên những người thân yêu nhất.",
        
        "Kính chúc Ông Bà năm mới vạn sự như ý, tứ quý bình an. Sức khỏe dồi dào như măng tre mọc sau mưa, hạnh phúc tràn đầy như hoa xuân nở rộ. Cháu biết Ông Bà đã hi sinh rất nhiều cho gia đình, đã vượt qua biết bao gian khó để có được cuộc sống ấm no ngày hôm nay. Cháu xin kính chúc Ông Bà được hưởng trọn những năm tháng vàng son, được con cháu chăm sóc, yêu thương và hiếu kính.",
    ],
    
    "bo-me": [
        // Sức khỏe & Sự nghiệp
        "Con kính chúc Bố Mẹ năm mới dồi dào sức khỏe, công việc thuận lợi, sự nghiệp thăng hoa. Mọi dự định đều thành công, gia đình luôn ấm êm, hạnh phúc trọn vẹn. Bố Mẹ là trụ cột của gia đình, là nguồn động viên lớn nhất cho con vươn lên trong cuộc sống. Con biết rằng, để có được ngày hôm nay, Bố Mẹ đã phải hy sinh rất nhiều. Con xin hứa sẽ luôn cố gắng học tập, làm việc thật tốt để không phụ lòng Bố Mẹ, để Bố Mẹ tự hào về con.",
        
        "Chúc Bố Mẹ năm mới an khang thịnh vượng, vạn sự như ý. Luôn khỏe mạnh, tươi trẻ, tràn đầy năng lượng. Công việc phát triển, tài lộc đầy túi, con cái noi gương học tập. Những năm tháng Bố Mẹ dành cho con là khoảng thời gian quý giá nhất. Mỗi bữa cơm gia đình, mỗi lời động viên, mỗi cái ôm yêu thương đều là những điều con trân trọng nhất. Con mong Bố Mẹ luôn khỏe mạnh, hạnh phúc, để được sống trọn vẹn những ước mơ và đam mê của mình.",
        
        "Con kính chúc Cha Mẹ năm mới bình an, hạnh phúc. Sức khỏe dồi dào, công danh viên mãn, tài lộc sung túc. Gia đình luôn sum họp, yên vui, được con hiếu kính. Con biết rằng công lao sinh thành, dưỡng dục của Cha Mẹ cao như núi Thái Sơn, sâu như nước biển Đông. Dù có cố gắng cả đời, con cũng không thể đền đáp hết. Nhưng con xin hứa sẽ luôn là người con hiếu thảo, luôn ở bên chăm sóc Cha Mẹ khi Cha Mẹ về già.",
        
        // Hạnh phúc gia đình
        "Năm mới con chúc Bố Mẹ luôn vui khỏe, hạnh phúc bên nhau. Mọi điều tốt đẹp đều đến, công việc thuận buồm xuôi gió, gia đình ấm áp, con cái ngoan ngoãn. Tình yêu thương mà Bố Mẹ dành cho nhau và cho con là điều quý giá nhất. Con rất may mắn khi được sinh ra trong một gia đình ấm áp, được sống trong tình yêu thương vô điều kiện của Bố Mẹ. Con xin chúc Bố Mẹ luôn hạnh phúc, luôn yêu thương nhau như ngày đầu tiên.",
        
        "Chúc Bố Mẹ năm mới tràn đầy niềm vui, sức khỏe bền lâu. Công danh thành đạt, gia đạo sum vầy, phúc lộc đầy nhà, tuổi già thanh thái an nhàn. Con hiểu rằng nuôi con khôn lớn không chỉ là cho con ăn học, mà còn là dạy con làm người, giúp con hình thành nhân cách và giá trị sống. Con xin cảm ơn Bố Mẹ vì tất cả. Mong Bố Mẹ luôn khỏe mạnh để được nhìn thấy con trưởng thành, thành đạt và hạnh phúc.",
        
        "Con xin chúc Bố Mẹ năm Bính Ngọ sức khỏe dồi dào, sự nghiệp thăng tiến, gia đình hạnh phúc. Mỗi ngày thức dậy đều là một ngày tốt lành, mọi công việc đều thuận lợi, mọi ước mơ đều thành hiện thực. Bố Mẹ đã dành cả thanh xuân để nuôi con khôn lớn, giờ đây đến lúc con phải trưởng thành để chăm sóc Bố Mẹ. Con xin hứa sẽ luôn là chỗ dựa vững chắc cho Bố Mẹ, giống như Bố Mẹ đã làm với con.",
        
        "Kính chúc Bố Mẹ năm mới phúc lộc đầy nhà, tài vận hanh thông. Sức khỏe như vàng như ngọc, tinh thần luôn tươi vui phấn chấn. Con cái học hành tấn tới, sự nghiệp viên mãn. Con biết Bố Mẹ luôn hy sinh vì con, luôn đặt hạnh phúc của con lên trên hết. Giờ đây con lớn rồi, con muốn Bố Mẹ hãy sống cho chính mình nhiều hơn, hãy thực hiện những ước mơ mà Bố Mẹ đã từng dành dụm. Con sẽ luôn ở đây, ủng hộ Bố Mẹ.",
        
        "Con chúc Bố Mẹ năm mới luôn tràn đầy năng lượng tích cực, gặp nhiều may mắn và thuận lợi. Công việc kinh doanh phát đạt, sức khỏe dồi dào, gia đình sum vầy. Nhìn lại những năm tháng đã qua, con thấy mình thật may mắn khi có Bố Mẹ bên cạnh. Bố Mẹ không chỉ nuôi con lớn, mà còn dạy con biết yêu thương, biết chia sẻ, biết sống có trách nhiệm. Con xin cảm ơn Bố Mẹ và hứa sẽ làm cho Bố Mẹ tự hào.",
    ],
    
    "anh-chi-em": [
        // Sự nghiệp
        "Chúc em/anh năm mới sự nghiệp thăng tiến, công việc hanh thông. Mọi mục tiêu đều đạt được, dự án nào cũng thành công, tài chính dồi dào, cuộc sống viên mãn. Biết bao kỷ niệm tuổi thơ chúng ta cùng nhau trải qua, từ những trận cãi nhau nhỏ nhặt đến những lúc san sẻ khó khăn với nhau. Giờ đây mỗi người một nơi, nhưng tình anh em vẫn luôn bền chặt. Mong em/anh luôn thành công, hạnh phúc, để khi về nhà chúng ta có thể cùng nhau chia sẻ những niềm vui.",
        
        "Năm mới chúc em/anh luôn khỏe mạnh, hạnh phúc. Sự nghiệp vươn cao, thành công rực rỡ, tình cảm gia đình thắm thiết, mọi điều tốt đẹp đều đến. Chúng ta lớn lên cùng nhau, hiểu nhau nhiều khi hơn cả bạn bè. Em/anh là người anh/em mà tôi luôn tự hào. Mong rằng năm mới này, em/anh sẽ gặp được nhiều cơ hội tốt, thực hiện được những ước mơ đã ấp ủ từ lâu, và luôn có gia đình là chỗ dựa vững chắc phía sau.",
        
        // Tình cảm & Gia đình
        "Chúc anh/chị năm mới an khang thịnh vượng, vạn sự như ý. Công danh viên mãn, tình duyên thuận lợi, gia đình hạnh phúc, con cái ngoan ngoãn học giỏi. Từ những ngày còn ở nhà, chúng ta đã luôn là chỗ dựa của nhau. Giờ đây dù mỗi người đều có gia đình riêng, nhưng tình anh em vẫn luôn là điều thiêng liêng nhất. Mong anh/chị luôn hạnh phúc, được sống trọn vẹn với những người mình yêu thương.",
        
        "Năm mới mong em/anh luôn vui vẻ, khỏe mạnh. Công việc thuận lợi, tài lộc dồi dào, tình yêu ngọt ngào, gia đình ấm áp sum vầy. Nhớ lại những kỷ niệm ngày xưa, từ lúc chúng ta còn nhỏ đến khi trưởng thành, mỗi khoảnh khắc đều đáng trân trọng. Em/anh luôn là người hiểu tôi nhất, là người tôi có thể chia sẻ mọi niềm vui nỗi buồn. Cảm ơn em/anh vì đã luôn ở đó.",
        
        "Chúc em/anh năm mới tràn đầy năng lượng, thành công trong mọi việc. Sự nghiệp phát triển vượt bậc, tình cảm bền chặt, cuộc sống ngày càng tốt đẹp. Dù xa cách hay gần gũi, dù bận rộn hay rảnh rỗi, chúng ta vẫn luôn là anh em. Mong em/anh luôn giữ gìn sức khỏe, luôn vui vẻ, lạc quan, và biết rằng gia đình luôn là nơi em/anh có thể quay về.",
        
        "Gửi em/anh, năm mới chúc em/anh gặp nhiều may mắn, thuận lợi trong công việc và cuộc sống. Gia đình ấm êm, con cái ngoan ngoãn, sự nghiệp thăng tiến như ý muốn. Chúng ta cùng cha mẹ sinh ra, cùng lớn lên trong một mái nhà, tình anh em là tình cảm máu mủ không gì có thể thay thế. Dù thời gian có trôi qua bao lâu, tình cảm này vẫn luôn bền vững.",
        
        "Chúc anh/chị/em năm Bính Ngọ sức khỏe dồi dào, tài lộc kéo tới ầm ầm. Mọi điều ước mơ đều thành hiện thực, mọi khó khăn đều vượt qua dễ dàng. Cảm ơn anh/chị/em đã luôn ở bên, chia sẻ với tôi trong những lúc khó khăn nhất. Mong rằng chúng ta sẽ luôn là chỗ dựa vững chắc cho nhau, dù cuộc sống có thay đổi thế nào.",
    ],
    
    "con-cai": [
        // Học tập
        "Con yêu, bố/mẹ chúc con năm mới khôn lớn, học giỏi. Mỗi ngày đều tiến bộ, luôn vui vẻ, ngoan ngoãn. Lớn lên thành người có ích, tương lai rạng rỡ, thành công rực rỡ. Con là niềm vui lớn nhất, là động lực để bố/mẹ cố gắng mỗi ngày. Bố/mẹ mong con luôn giữ được sự hồn nhiên, trong sáng như hiện tại, đồng thời học hỏi thêm nhiều điều mới mẻ, phát triển bản thân toàn diện. Con hãy nhớ, dù con có làm gì, bố/mẹ luôn yêu thương và ủng hộ con.",
        
        "Chúc con năm mới luôn khỏe mạnh, học tập tốt. Yêu thích đọc sách, ham học hỏi, thành tích cao, bạn bè quý mến, thầy cô yêu thương. Mỗi lần nhìn con lớn lên từng ngày, bố/mẹ lại thấy hạnh phúc và tự hào biết bao. Con là kho báu quý giá nhất của bố/mẹ, là lý do để bố/mẹ cố gắng xây dựng một tương lai tốt đẹp. Hãy luôn tự tin, nỗ lực, và biết rằng bố/mẹ luôn ở đây cổ vũ cho con.",
        
        // Tương lai
        "Con yêu, năm mới bố/mẹ chúc con luôn vui cười, bình an. Lớn lên ngoan ngoãn, học giỏi chơi khỏe. Trở thành người tài giỏi, hiếu thảo, làm cha mẹ tự hào. Bố/mẹ không mong con phải hoàn hảo, chỉ mong con luôn cố gắng hết mình, sống thật với chính mình. Hãy nuôi dưỡng ước mơ của mình, đừng sợ thất bại, vì thất bại chính là bài học quý giá nhất. Bố/mẹ sẽ luôn đồng hành cùng con trên con đường trưởng thành.",
        
        "Chúc con năm mới mạnh khỏe, thông minh. Mỗi ngày đều học được điều mới, nuôi dưỡng ước mơ lớn, lớn lên thành người ưu tú, hạnh phúc trọn đời. Bố/mẹ muốn con biết rằng, hạnh phúc không chỉ nằm ở thành công hay tiền bạc, mà còn nằm ở những điều giản dị: gia đình ấm áp, bạn bè chân thành, và một trái tim biết yêu thương. Hãy sống tử tế, con nhé.",
        
        "Con yêu quý, chúc con năm mới tràn đầy niềm vui. Luôn được yêu thương, chở che, học hành tốt, sức khỏe dồi dào, tương lai xán lạn. Con là món quà quý giá nhất mà cuộc đời trao cho bố/mẹ. Mỗi tiếng cười của con, mỗi lời nói ngây thơ đều khiến bố/mẹ cảm thấy cuộc sống thật ý nghĩa. Bố/mẹ hứa sẽ luôn cố gắng để là tấm gương tốt cho con noi theo.",
        
        "Gửi con yêu của bố/mẹ, năm mới chúc con luôn vui tươi, khỏe mạnh như tre măng mọc sau mưa. Học hành tấn tới, bạn bè đông đảo, thầy cô yêu quý. Con là niềm hy vọng của gia đình, là tương lai của đất nước. Hãy cố gắng học tập thật tốt, nhưng đừng quên chăm sóc sức khỏe, đừng quên vui chơi và nghỉ ngơi. Cuộc sống cần sự cân bằng, con ạ.",
        
        "Con thân yêu, năm Bính Ngọ bố/mẹ chúc con luôn hạnh phúc, bình an. Lớn lên trong tình yêu thương, được giáo dục tốt, có tương lai tươi sáng. Mỗi đứa trẻ đều là một thiên thần nhỏ, và con là thiên thần của bố/mẹ. Bố/mẹ sẽ luôn bảo vệ con, yêu thương con vô điều kiện. Hãy lớn lên thật khỏe mạnh, thật hạnh phúc nhé con.",
        
        "Con ơi, năm mới bố/mẹ chúc con ngày càng thông minh, lanh lợi. Ham học hỏi, tò mò khám phá thế giới xung quanh. Khi lớn lên, con sẽ nhận ra rằng kiến thức là vũ khí mạnh nhất. Hãy học tập thật chăm chỉ, nhưng cũng đừng quên rằng bố/mẹ yêu con không phải vì con học giỏi, mà vì con là con của bố/mẹ. Dù con có làm gì, bố/mẹ luôn ở đây.",
    ],
    
    "ban-be": [
        // Tình bạn
        "Chúc bạn năm mới sự nghiệp thành công, tình bạn bền chặt. Chúng ta luôn là tri kỷ, cùng nhau vượt mọi khó khăn, chia sẻ niềm vui, mãi mãi bên nhau. Biết bao nhiêu kỷ niệm đẹp chúng ta đã cùng tạo nên, từ những ngày tháng học trò ngây thơ đến khi trưởng thành, bước vào đời. Tình bạn của chúng ta là điều quý giá mà tôi luôn trân trọng. Dù cuộc sống có bận rộn đến đâu, tôi tin chúng ta vẫn luôn là bạn thân của nhau.",
        
        "Năm mới chúc bạn thân luôn khỏe mạnh, hạnh phúc. Công việc thuận lợi, tài lộc dồi dào, tình bạn của chúng ta ngàn năm không đổi, luôn đồng hành cùng nhau. Cảm ơn bạn đã luôn ở đây khi tôi cần, đã lắng nghe những tâm sự của tôi, đã chia sẻ cả niềm vui lẫn nỗi buồn. Bạn không chỉ là bạn, bạn còn như người anh/chị/em mà tôi chưa bao giờ có. Mong rằng tình bạn này sẽ mãi bền lâu.",
        
        // Thành công
        "Chúc bạn năm mới vạn sự như ý, mọi điều tốt đẹp. Cùng nhau lên đỉnh, đạt được ước mơ, tình bạn vĩnh cửu, hạnh phúc viên mãn. Chúng ta đã cùng nhau đi qua biết bao thăng trầm, cùng nhau lớn lên, cùng nhau trưởng thành. Những kỷ niệm ấy là tài sản vô giá trong cuộc đời tôi. Mong bạn luôn thành công trong sự nghiệp, hạnh phúc trong tình yêu, và luôn nhớ rằng tôi luôn ở đây khi bạn cần.",
        
        "Năm mới chúc bạn yêu luôn tươi trẻ, năng động. Sự nghiệp thăng tiến, tình yêu ngọt ngào, tình bạn thắm thiết, cuộc sống tràn đầy màu sắc. Chúng ta đã cùng nhau chia sẻ bao nhiêu bí mật, bao nhiêu ước mơ. Giờ đây khi lớn lên, tôi vẫn muốn chúng ta tiếp tục như vậy. Hãy luôn giữ liên lạc, luôn chia sẻ với nhau, vì bạn là người tôi tin tưởng nhất.",
        
        "Chúc bạn thân năm mới thành công rực rỡ, hạnh phúc ngập tràn. Chúng ta mãi là tuổi trẻ, mãi là tri kỷ, cùng nhau tạo nên những kỷ niệm đẹp. Tình bạn chân chính không đo bằng thời gian gặp mặt, mà đo bằng sự thấu hiểu và sẵn sàng chia sẻ. Dù xa hay gần, dù bận hay rảnh, chúng ta vẫn luôn là bạn thân của nhau. Cảm ơn bạn vì tất cả.",
        
        "Gửi người bạn thân yêu, năm mới chúc bạn gặp nhiều may mắn, cơ hội tốt lành. Công việc thăng tiến, gia đình hạnh phúc, sức khỏe dồi dào. Có bạn bên cạnh, cuộc sống của tôi thêm phần ý nghĩa. Chúng ta đã cười cùng nhau, khóc cùng nhau, cùng chia sẻ những khoảnh khắc đẹp nhất. Mong rằng tình bạn này sẽ không bao giờ phai nhạt.",
        
        "Chúc mừng năm mới người bạn tri kỷ của tôi. Mong bạn luôn vui vẻ, hạnh phúc, thành công trong mọi việc. Chúng ta đã cùng nhau trải qua tuổi học trò tươi đẹp, giờ đây bước vào đời, dù đường ai nấy đi nhưng tình bạn vẫn luôn ở đó. Hãy luôn giữ liên lạc, hãy luôn nhớ rằng bạn có một người bạn luôn sẵn sàng lắng nghe và chia sẻ.",
        
        "Năm Bính Ngọ, chúc bạn thân của tôi mọi điều tốt đẹp nhất. Sức khỏe dồi dào, tài lộc kéo đến, tình yêu như ý, sự nghiệp thăng hoa. Tôi rất may mắn khi có bạn trong cuộc đời. Bạn đã làm cho cuộc sống của tôi thêm phần đầy màu sắc, thêm phần ý nghĩa. Cảm ơn bạn vì tất cả, và mong chúng ta sẽ mãi là bạn thân.",
    ],
    
    "dong-nghiep": [
        // Công việc
        "Chúc đồng nghiệp năm mới sự nghiệp thăng tiến, công việc thuận lợi. Mọi dự án đều thành công, mục tiêu nào cũng đạt được, thu nhập tăng cao, thăng chức sớm. Làm việc cùng bạn là một niềm vui, là một trải nghiệm quý giá. Cảm ơn bạn đã luôn hỗ trợ, đồng hành và chia sẻ trong công việc. Mong rằng năm mới này, chúng ta sẽ tiếp tục hợp tác tốt đẹp, cùng nhau đạt được những thành tựu lớn hơn nữa.",
        
        "Năm mới chúc bạn luôn khỏe mạnh, năng động. Công việc hanh thông, cơ hội mới đến liên tục, sự nghiệp phát triển vượt bậc, đời sống sung túc. Trong môi trường công sở, có một đồng nghiệp tốt là một may mắn lớn. Bạn không chỉ là đồng nghiệp mà còn là người bạn, là người tôi có thể tin tưởng và chia sẻ. Chúc bạn luôn gặp nhiều thuận lợi trong sự nghiệp.",
        
        // Hợp tác
        "Chúc cộng sự năm mới vạn sự như ý, thành công viên mãn. Chúng ta tiếp tục đồng hành, cùng nhau xây dựng, tạo nên thành tựu vượt trội. Sự hợp tác giữa chúng ta đã mang lại nhiều kết quả tích cực. Tôi rất trân trọng sự chuyên nghiệp và tinh thần làm việc của bạn. Mong rằng chúng ta sẽ có thêm nhiều dự án thành công trong năm mới này.",
        
        "Năm mới chúc đồng nghiệp luôn tràn đầy nhiệt huyết, sáng tạo. Công việc thuận buồm xuôi gió, thăng tiến nhanh chóng, cuộc sống ngày càng tốt đẹp. Làm việc trong một môi trường tích cực, với những đồng nghiệp năng động như bạn là điều tuyệt vời. Cảm ơn bạn đã tạo nên không khí làm việc vui vẻ, hiệu quả. Chúc bạn đạt được nhiều thành công hơn nữa.",
        
        "Chúc bạn năm mới năng lượng dồi dào, thành công rực rỡ. Chung tay xây dựng, cùng nhau phát triển, đạt được mục tiêu cao nhất. Sự đóng góp của bạn cho team, cho công ty là rất lớn. Tôi học được nhiều điều từ bạn, cả về chuyên môn lẫn cách làm việc. Mong rằng chúng ta sẽ tiếp tục là đồng đội tốt, cùng nhau vươn xa.",
        
        "Gửi đồng nghiệp thân thiết, năm mới chúc bạn công danh phát đạt, tài lộc hanh thông. Mọi nỗ lực đều được đền đáp xứng đáng, mọi khó khăn đều vượt qua thuận lợi. Cùng làm việc với bạn là một trải nghiệm tuyệt vời. Bạn không chỉ giỏi về chuyên môn mà còn là người tốt bụng, nhiệt tình. Cảm ơn bạn và chúc bạn luôn thành công.",
        
        "Chúc đồng nghiệp năm Bính Ngọ sức khỏe dồi dào, công việc thuận lợi. Được cấp trên tín nhiệm, đồng nghiệp quý mến, khách hàng hài lòng. Trong môi trường công sở đầy cạnh tranh, có một đồng nghiệp đáng tin cậy như bạn là điều quý giá. Chúc bạn luôn giữ vững tinh thần làm việc và đạt được những thành tựu cao hơn nữa.",
        
        "Năm mới chúc cộng sự luôn tràn đầy động lực, sáng tạo không ngừng. Dự án nào cũng thành công, KPI nào cũng vượt. Cảm ơn bạn đã là người đồng đội tuyệt vời, luôn sẵn sàng hỗ trợ khi cần. Mong rằng năm mới chúng ta sẽ có thêm nhiều cơ hội hợp tác, cùng nhau tạo nên những giá trị lớn hơn cho công ty.",
    ],
    
    "thay-co": [
        // Sức khỏe & Sự nghiệp
        "Kính chúc Thầy/Cô năm mới sức khỏe dồi dào, công tác thuận lợi. Lâu năm dạy dỗ, sớm hưởng thụ tuổi già thanh thái. Học trò luôn kính mến, biết ơn công lao dạy dỗ. Thầy/Cô đã dành cả thanh xuân để đứng trên bục giảng, truyền đạt kiến thức và giá trị nhân văn cho thế hệ học trò. Công lao ấy không gì đo đếm được. Em xin kính chúc Thầy/Cô luôn khỏe mạnh, hạnh phúc, được nhìn thấy học trò trưởng thành và thành đạt.",
        
        "Năm mới kính chúc Thầy/Cô luôn khỏe mạnh, hạnh phúc. Công việc giảng dạy hiệu quả, học sinh ngoan ngoãn học giỏi, được nhà trường trọng dụng, gia đình ấm áp. Mỗi bài học của Thầy/Cô không chỉ là kiến thức sách vở, mà còn là bài học về cuộc sống, về làm người. Em sẽ luôn ghi nhớ những lời dạy bảo quý giá ấy. Cảm ơn Thầy/Cô rất nhiều.",
        
        "Kính chúc Thầy/Cô năm mới tràn đầy năng lượng, nhiệt huyết. Nghiêm túc mà vui vẻ, công tác thuận lợi, thế hệ học trò nối tiếp, tôn sư trọng đạo. Thầy/Cô không chỉ dạy em kiến thức, mà còn định hướng cho em con đường đi, giúp em hình thành nhân cách và giá trị sống. Em xin chúc Thầy/Cô luôn được yêu mến, được kính trọng, và được hưởng niềm vui từ sự thành công của học trò.",
        
        // Tri ân
        "Em kính chúc Thầy/Cô năm mới bình an, hạnh phúc. Sức khỏe dồi dào, sự nghiệp giáo dục thành công rực rỡ. Mãi mãi là ngọn đuốc soi đường cho học trò. Nghề giáo là nghề cao quý nhất, vì Thầy/Cô đang gầy dựng tương lai của đất nước qua từng thế hệ học sinh. Em rất tự hào khi được là học trò của Thầy/Cô, và sẽ luôn cố gắng để không phụ lòng Thầy/Cô.",
        
        "Kính chúc Thầy/Cô năm mới vạn sự như ý, phúc lộc đầy nhà. Công lao dạy dỗ muôn đời, học trò luôn ghi nhớ, kính trọng, biết ơn sâu sắc. Từ những ngày còn ngồi trên ghế nhà trường, em đã được Thầy/Cô dạy dỗ, chỉ bảo tận tình. Giờ đây khi đã trưởng thành, em mới hiểu được giá trị của những bài học ấy. Cảm ơn Thầy/Cô vì tất cả.",
        
        "Thưa Thầy/Cô kính mến, năm mới em xin chúc Thầy/Cô sức khỏe như sắt, tinh thần minh mẫn. Công tác giảng dạy thuận lợi, học sinh yêu quý, đồng nghiệp kính trọng. Thầy/Cô là người thầy tốt nhất mà em từng có, là người đã mở ra cho em những chân trời tri thức mới. Em xin hứa sẽ luôn học tập thật tốt, sống thật tốt để không phụ công ơn dạy dỗ của Thầy/Cô.",
        
        "Kính gửi Thầy/Cô, năm Bính Ngọ em chúc Thầy/Cô luôn tươi trẻ, nhiệt huyết với nghề. Được Ban Giám Hiệu tin tưởng, phụ huynh kính trọng, học sinh yêu mến. Nghề giáo tuy vất vả nhưng cao quý. Thầy/Cô đã lựa chọn con đường này và đã cống hiến rất nhiều. Em xin chúc Thầy/Cô luôn được gặt hái thành công, luôn được hạnh phúc.",
        
        "Em kính chúc Thầy/Cô năm mới phúc thọ an khang, gia đình hạnh phúc. Công việc giảng dạy đạt nhiều thành tích cao. Thầy/Cô như ngọn đèn trong đêm tối, soi sáng con đường cho biết bao thế hệ học trò. Công lao ấy cao như núi, sâu như biển. Em sẽ luôn ghi nhớ và biết ơn Thầy/Cô suốt đời.",
    ],
    
    "nguoi-thuong": [
        // Tình yêu
        "Em/Anh yêu, chúc chúng ta năm mới yêu thương trọn đời, bên nhau mãi mãi. Hạnh phúc viên mãn, chia sẻ mọi niềm vui nỗi buồn, cùng nhau vượt mọi khó khăn. Gặp được em/anh là may mắn lớn nhất của đời anh/em. Em/anh không chỉ là người yêu, mà còn là bạn đời, là tri kỷ, là người anh/em muốn ở bên suốt cuộc đời. Hãy cùng nhau tạo nên một tương lai tươi đẹp, cùng nhau viết nên câu chuyện tình yêu của riêng chúng ta.",
        
        "Năm mới chúc em/anh luôn khỏe mạnh, xinh đẹp/đẹp trai hơn. Tình yêu của chúng ta ngàn năm không đổi, bình an đến cuối đời, hạnh phúc ngập tràn. Mỗi ngày được ở bên em/anh là một ngày hạnh phúc. Anh/em hứa sẽ luôn yêu thương, chăm sóc và bảo vệ em/anh. Chúng ta sẽ cùng nhau đối mặt với mọi thăng trầm của cuộc sống, luôn nắm chặt tay nhau và không bao giờ buông.",
        
        "Chúc em/anh yêu năm mới rực rỡ, tình yêu ngọt ngào. Chúng ta luôn bên nhau, nắm tay nhau đi suốt cuộc đời, viết nên câu chuyện tình yêu đẹp nhất. Từ ngày gặp em/anh, cuộc sống của anh/em đã thay đổi hoàn toàn. Em/anh mang lại cho anh/em niềm vui, hy vọng và ý nghĩa. Anh/em yêu em/anh không chỉ bằng lời nói, mà bằng hành động, bằng cả trái tim và tâm hồn.",
        
        // Hạnh phúc chung
        "Em/Anh thương yêu, chúc chúng ta năm mới ấm áp, hạnh phúc. Công việc thuận lợi, tài chính dồi dào, tình yêu bền vững, gia đình sum vầy. Anh/em mơ ước một tương lai nơi chúng ta có một mái nhà nhỏ, có con cái quây quần, có cuộc sống bình yên và hạnh phúc. Hãy cùng nhau nỗ lực để biến ước mơ đó thành hiện thực. Anh/em tin rằng với tình yêu của chúng ta, không có gì là không thể.",
        
        "Năm mới chúc người yêu của anh/em luôn vui cười, khỏe mạnh. Chúng ta sẽ cùng nhau xây dựng tổ ấm, nuôi dưỡng ước mơ, sống hạnh phúc trọn đời. Em/anh là người anh/em muốn chia sẻ tất cả mọi thứ, từ niềm vui đến nỗi buồn, từ thành công đến thất bại. Cảm ơn em/anh đã đến bên anh/em, đã làm cho cuộc đời anh/em trọn vẹn. Anh/em yêu em/anh rất nhiều.",
        
        "Gửi người tôi yêu nhất, năm mới chúc em/anh luôn rạng rỡ, tươi vui. Tình yêu của chúng ta ngày càng sâu đậm, cuộc sống ngày càng tốt đẹp. Tôi hứa sẽ luôn là chỗ dựa vững chắc cho em/anh, luôn ở bên khi em/anh cần. Chúng ta sẽ cùng nhau đi qua mọi thử thách, cùng nhau tạo nên những kỷ niệm đẹp đẽ, cùng nhau già đi trong hạnh phúc.",
        
        "Em/anh yêu dấu, năm Bính Ngọ chúc chúng ta luôn hòa hợp, thấu hiểu nhau. Tình yêu bền chặt như đá, ngọt ngào như mật. Gặp được em/anh là định mệnh của đời tôi. Tôi biết ơn cuộc sống đã đưa chúng ta đến với nhau. Hãy cùng nhau trân trọng tình yêu này, cùng nhau vun đắp hạnh phúc, cùng nhau xây dựng tương lai.",
        
        "Thương yêu em/anh, năm mới chúc chúng ta luôn là một, luôn yêu thương, chia sẻ và thấu hiểu. Dù cuộc sống có khó khăn thế nào, chỉ cần có em/anh bên cạnh, tôi đều cảm thấy mạnh mẽ. Em/anh là động lực lớn nhất cho tôi cố gắng mỗi ngày. Tôi hứa sẽ luôn yêu thương em/anh, chăm sóc em/anh và làm cho em/anh hạnh phúc nhất trên đời.",
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
    "nguoi-thuong": ["Yêu thương em/anh", "Từ trái tim", "Chỉ dành riêng cho em/anh"],
};

// Hàm random lời chúc theo loại người nhận
function getRandomLetterContent(recipientKey) {
    const greeting = letterGreetings[recipientKey] 
        ? letterGreetings[recipientKey][Math.floor(Math.random() * letterGreetings[recipientKey].length)]
        : "Chúc mừng";
    
    const blessing = letterBlessings[recipientKey]
        ? letterBlessings[recipientKey][Math.floor(Math.random() * letterBlessings[recipientKey].length)]
        : "tràn đầy hạnh phúc";
    
    const closing = letterClosings[recipientKey]
        ? letterClosings[recipientKey][Math.floor(Math.random() * letterClosings[recipientKey].length)]
        : "Trân trọng";
    
    return {
        greeting,
        blessing,
        closing,
        fullText: `${greeting},\n\n${blessing}\n\n${closing}!`
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
    -3.2 * scale, 3.2 * scale, 
    -5.2 * scale, 5.2 * scale, 
    -7.2 * scale, 7.2 * scale, 
    -9.2 * scale, 9.2 * scale
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
    -3.2 * scale, 3.2 * scale, 
    -5.4 * scale, 5.4 * scale, 
    -7.4 * scale, 7.4 * scale, 
    -10.4 * scale, 10.4 * scale
  ];

  sequence.forEach((angle, i) => {
    setTimeout(() => {
      launch(angle);
    }, i * 220);   // <<< khoảng cách giữa mỗi lần bắn (ms)
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
      { base: "#ffe135", light: "#fff3a5" }
    ];
    const colorSet = colors[uid % colors.length];

    const shapes = [
      `M12,5 Q20,10 20,20 Q12,15 5,20 Q5,10 12,5Z`,
      `M20,6 Q25,13 20,20 Q15,13 20,6Z`,
      `M20,8 Q23,13 20,18 Q17,13 20,8Z`,
      `M12,3 Q20,12 12,22 Q5,12 12,3Z`
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

  function rand(a, b) { return a + Math.random() * (b - a); }

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
      height:${w*0.9}px;
      filter:drop-shadow(0 4px 6px rgba(255,215,0,0.3));
      animation:petalFloatAndDrift ${rand(14,22)}s linear forwards;
      --drift-x-early:${rand(-60,60)}px;
      --drift-x-mid:${rand(-80,80)}px;
      --drift-x-late:${rand(-60,60)}px;
      --drift-x-final:${rand(-40,40)}px;
      --drift-x-end:${rand(-30,30)}px;
      --drift-x-pull:${rand(-20,20)}px;
    `;

    const spin = document.createElement("div");
    spin.style.cssText = `
      width:100%;
      height:100%;
      animation:
        petalGentleSway ${rand(4,7)}s ease-in-out infinite,
        petalGentleRotate ${rand(12,20)}s linear infinite;
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