// ===== HÀM FORMAT TIỀN =====
function formatMoney(amount, options = {}) {
    const {
        unit = "đ", // Đơn vị tiền tệ
        showUnit = true, // Hiển thị đơn vị hay không
        separator = ".", // Dấu phân cách hàng nghìn
        decimals = 0, // Số chữ số thập phân
        prefix = "", // Tiền tố (VD: "VND ")
    } = options;

    // Chuyển thành số
    const numAmount = parseFloat(amount) || 0;

    // Format với dấu phân cách
    const formatted = numAmount
        .toFixed(decimals)
        .replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    // Ghép prefix và unit
    return `${prefix}${formatted}${showUnit ? unit : ""}`;
}

// Shorthand cho format VND
function formatVND(amount, showUnit = true) {
    return formatMoney(amount, {
        unit: "đ",
        showUnit: showUnit,
        separator: ".",
    });
}

// Shorthand cho format nghìn VND (10 → 10.000đ)
function formatThousandVND(amount) {
    return formatMoney(amount * 1000, {
        unit: "đ",
        separator: ".",
    });
}
// ===========================


// ===== HÀM FORMAT INPUT =====
function formatNumberInput(value) {
    // Loại bỏ tất cả ký tự không phải số
    const numbers = value.replace(/\D/g, '');
    
    // Nếu rỗng thì return rỗng
    if (!numbers) return '';
    
    // Format với dấu chấm ngăn cách hàng nghìn
    return parseInt(numbers).toLocaleString('vi-VN');
}

function parseNumberInput(value) {
    // Chuyển từ "10.000" về 10000
    return parseInt(value.replace(/\D/g, '')) || 0;
}
// ============================

// Random mệnh giá tròn chục (chia hết cho 10000)
// ===== PHÂN BỔ MỆNH GIÁ THEO TỶ LỆ (TRÒN 10.000đ) =====
function getRandomTronChuc(min, max) {
    // Đảm bảo min và max là tròn 10k
    const minTron = Math.ceil(min / 10000) * 10000;
    const maxTron = Math.floor(max / 10000) * 10000;
    
    // Tính range
    const range = maxTron - minTron;
    
    // Các mốc phân chia theo tỷ lệ 50-30-20
    const trungBinhThreshold = minTron + Math.floor(range * 0.5 / 10000) * 10000; // 50% đầu
    const khaThreshold = minTron + Math.floor(range * 0.8 / 10000) * 10000;        // 80% (50% + 30%)
    
    // Random theo tỷ lệ
    const rand = Math.random();
    
    let value;
    if (rand < 0.5) {
        // 50% → Khoảng thấp (min đến trungBinh)
        const steps = (trungBinhThreshold - minTron) / 10000;
        const randomStep = Math.floor(Math.random() * (steps + 1));
        value = minTron + randomStep * 10000;
    } else if (rand < 0.8) {
        // 30% → Khoảng trung bình (trungBinh đến khá)
        const steps = (khaThreshold - trungBinhThreshold) / 10000;
        const randomStep = Math.floor(Math.random() * (steps + 1));
        value = trungBinhThreshold + randomStep * 10000;
    } else {
        // 20% → Khoảng cao (khá đến max)
        const steps = (maxTron - khaThreshold) / 10000;
        const randomStep = Math.floor(Math.random() * (steps + 1));
        value = khaThreshold + randomStep * 10000;
    }
    
    return value;
}
// ===== END PHÂN BỔ MỆNH GIÁ =====