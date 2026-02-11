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
function getRandomTronChuc(min, max) {
    // Đảm bảo min và max là tròn chục
    const minTron = Math.ceil(min / 10000) * 10000;
    const maxTron = Math.floor(max / 10000) * 10000;
    
    // Số bước (mỗi bước 10k)
    const steps = (maxTron - minTron) / 10000;
    
    // Random bước
    const randomStep = Math.floor(Math.random() * (steps + 1));
    
    // Tính mệnh giá
    const amount = minTron + randomStep * 10000;
    
    return amount;
}