
// <!-- Pháo hoa -->
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];
let particles = [];
let currentRockets = 0;
const MAX_ROCKETS = 10;

class Particle {
    constructor(x, y, color, isRocket = false, targetY = 0) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isRocket = isRocket;
        this.targetY = targetY;
        this.alpha = 1;

        if (this.isRocket) {
            this.velocity = {
                x: (Math.random() - 0.5) * 10,
                y: -10 - Math.random() * 4,
            };
            this.friction = 1;
            this.gravity = 0.1;
        } else {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 2;
            this.velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed,
            };
            this.friction = 0.95;
            this.gravity = 0.15;
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.isRocket ? 3 : 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x - this.velocity.x * 2,
            this.y - this.velocity.y * 2,
        );
        ctx.stroke();
        ctx.restore();
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        if (this.isRocket) {
            if (this.y <= this.targetY || this.velocity.y >= 0) {
                this.alpha = 0;
                explode(this.x, this.y, this.color);
            }
        } else {
            this.alpha -= 0.015;
        }
    }
}

function explode(x, y, color) {
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// CHỈ GIỮ LẠI MỘT HÀM LAUNCH DUY NHẤT
function launch() {
    if (currentRockets >= MAX_ROCKETS) return;

    currentRockets++;
    
    const launchPoints = [canvas.width * 0.2, canvas.width * 0.5, canvas.width * 0.8];
    const baseLineX = launchPoints[Math.floor(Math.random() * launchPoints.length)];
    const x = baseLineX + (Math.random() - 0.5) * 50; 
    const targetY = Math.random() * (canvas.height * 0.4);
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const rocket = new Particle(x, canvas.height, color, true, targetY);
    
    // Xử lý giảm biến đếm khi pháo nổ
    const originalUpdate = rocket.update;
    rocket.update = function() {
        const wasAlive = this.alpha > 0;
        originalUpdate.call(this);
        if (wasAlive && this.alpha <= 0) {
            currentRockets--;
        }
    };

    particles.push(rocket);
}

function animate() {
    // 1. Thay vì dùng màu trắng đè lên, ta dùng chế độ 'destination-out'
    // Nó sẽ làm mờ dần các hạt cũ trực tiếp vào sự TRONG SUỐT
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)"; // Con số 0.15 giữ nguyên độ dài đuôi
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Trả về chế độ vẽ bình thường để vẽ hạt mới
    ctx.globalCompositeOperation = 'source-over';

    if (particles.length > 0) {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw();
            if (p.alpha <= 0) {
                particles.splice(i, 1);
            }
        }
    } else {
        // 3. Khi không còn hạt nào, xóa sạch hoàn toàn để trang web sạch bóng
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    requestAnimationFrame(animate);
}

document.getElementById("launchBtn").addEventListener("click", () => {
    let cumulativeDelay = 0;
    for (let i = 0; i < 30; i++) {
        let currentDelay = (i < 3) ? 250 : (i < 10) ? 150 : 50;
        cumulativeDelay += currentDelay;
        setTimeout(launch, cumulativeDelay);
    }
});

animate();
{/* <!-- End Pháo hoa --> */}
