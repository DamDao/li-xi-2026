// <!-- Setting mệnh giá lì xì -->
// ===== CẤU HÌNH SỐ LƯỢNG LÌ XỈ =====
const TOTAL_ENVELOPES = 64; // Tổng số lì xì (thay đổi số này để điều chỉnh tổng lì xì)

// ===== XỬ LÝ MODAL CÀI ĐẶT =====
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');
const saveSettings = document.getElementById('save-settings');
const resetSettings = document.getElementById('reset-settings');

// Giá trị mặc định khi chưa có cài đặt trong localStorage
const DEFAULT_ENVELOPE_SETTINGS = {
    min: 10000,
    max: 50000,
    specialAmount: 100000,
    specialCount: 1,
    // customSpecials: []  // nếu có thêm mệnh giá đặc biệt khác
};

// ===== Form =====
// ===== GENERATE FORM CÀI ĐẶT =====
function generateSettingsForm() {
    const container = document.getElementById('settings-form-container');
    container.innerHTML = ''; // Xóa nội dung cũ

    // Lấy cài đặt từ localStorage (hoặc dùng mặc định)
    const savedSettings = JSON.parse(localStorage.getItem('envelopeSettings') || '{}');

    // Loop qua tất cả người nhận
    Object.keys(recipientNames).forEach(key => {
        const name = recipientNames[key];
        const icon = recipientIcons[key];

        // Lấy giá trị đã lưu hoặc dùng mặc định
        const settings = savedSettings[key] || { min: 10000, max: 50000, specialCount: 1 };

        // Tính toán các giá trị ban đầu
        const initialSpecialAmount = settings.specialAmount || 100000 || settings.max; // Mặc định = max
        const initialSpecialCount = settings.specialCount || 1;

        let initialPreviewText = '';
        if (initialSpecialCount === 0) {
            initialPreviewText = `0 bao sẽ có mệnh giá ${formatVND(initialSpecialAmount)}`;
        } else if (initialSpecialCount === 1) {
            initialPreviewText = `1 bao sẽ có mệnh giá ${formatVND(initialSpecialAmount)} 🎉`;
        } else {
            initialPreviewText = `${initialSpecialCount} bao sẽ có mệnh giá ${formatVND(initialSpecialAmount)} 🎉`;
        }

        const initialNormalCount = TOTAL_ENVELOPES - initialSpecialCount;
        let initialSpecialListHTML = '';
        if (initialSpecialCount > 0) {
            initialSpecialListHTML = `<div>• <span class="font-semibold text-yellow-600">${initialSpecialCount} bao ĐẶC BIỆT</span>: ${formatVND(initialSpecialAmount)} 🌟</div>`;
        }

        // Tạo card
        const card = document.createElement('div');
        card.className = 'setting-card bg-white rounded-lg p-4 shadow-md border-2 border-tet-gold/30 hover:border-tet-gold transition';
        card.dataset.recipient = key;
        card.innerHTML = `
                    <div class="flex items-center gap-3 mb-3">
                        <span class="text-3xl">${icon}</span>
                        <h3 class="font-heading text-xl font-bold text-tet-red">${name}</h3>
                        <span class="toggle-advanced text-end cursor-pointer ml-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 640 640">
                                <path fill="#74c0fc" d="M96 128C78.3 128 64 142.3 64 160C64 177.7 78.3 192 96 192L182.7 192C195 220.3 223.2 240 256 240C288.8 240 317 220.3 329.3 192L544 192C561.7 192 576 177.7 576 160C576 142.3 561.7 128 544 128L329.3 128C317 99.7 288.8 80 256 80C223.2 80 195 99.7 182.7 128L96 128zM96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L342.7 352C355 380.3 383.2 400 416 400C448.8 400 477 380.3 489.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L489.3 288C477 259.7 448.8 240 416 240C383.2 240 355 259.7 342.7 288L96 288zM96 448C78.3 448 64 462.3 64 480C64 497.7 78.3 512 96 512L150.7 512C163 540.3 191.2 560 224 560C256.8 560 285 540.3 297.3 512L544 512C561.7 512 576 497.7 576 480C576 462.3 561.7 448 544 448L297.3 448C285 419.7 256.8 400 224 400C191.2 400 163 419.7 150.7 448L96 448z"/>
                            </svg>
                        </span>
                    </div>
                    
                    <div class="space-y-3">
                        <!-- Min -->
                        <div>
                            <label class="text-sm text-gray-600 block mb-1">Mệnh giá tối thiểu (VND)</label>
                            <input type="text" 
                                class="setting-input-min w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tet-gold focus:outline-none"
                                data-recipient="${key}" 
                                data-field="min"
                                value="${formatNumberInput(settings.min.toString())}"
                                inputmode="numeric"
                                placeholder="10.000">
                        </div>
                        
                        <!-- Max -->
                        <div>
                            <label class="text-sm text-gray-600 block mb-1">Mệnh giá tối đa (VND)</label>
                            <input type="text" 
                                class="setting-input-max w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tet-gold focus:outline-none"
                                data-recipient="${key}" 
                                data-field="max"
                                value="${formatNumberInput(settings.max.toString())}"
                                inputmode="numeric"
                                placeholder="100.000">
                        </div>
                        
                        <!-- Special Amount (MỚI) -->
                        <div>
                            <label class="text-sm text-gray-600 block mb-1">
                                Mệnh giá đặc biệt (VND)
                                <span class="text-xs text-yellow-600">✨ May mắn</span>
                            </label>
                            
                            <!-- Áp dụng mệnh giá đặc biệt này cho tất cả  -->
                            <label class="form-check-label text-sm mb-1">
                                <input type="checkbox" class="form-check-input text-sm" data-apply="special" value="1"> Áp dụng cho tất cả 
                            </label>

                            <input type="text" 
                                class="setting-input-special-amount w-full px-3 py-2 border-2 border-yellow-300 bg-yellow-50 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                                data-recipient="${key}" 
                                data-field="special-amount"
                                value="${formatNumberInput(initialSpecialAmount.toString())}"
                                inputmode="numeric"
                                placeholder="200.000">
                                
                        </div>
                        
                        <!-- Preview Random Range với nút toggle -->
                        <div class="text-xs text-gray-500 bg-gray-50 p-2 rounded flex items-center justify-between">
                            <span>💡 Random từ: <strong class="preview-min">${formatVND(settings.min)}</strong> → <strong class="preview-max">${formatVND(settings.max)}</strong></span>
                            <button class="toggle-distribution text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer text-xs ml-2">
                                Thể lệ ▼
                            </button>
                        </div>

                        <!-- ✨ Distribution Preview - MẶC ĐỊNH ẨN -->
                        ${(() => {
                            const minTron = Math.ceil(settings.min / 10000) * 10000;
                            const maxTron = Math.floor(settings.max / 10000) * 10000;
                            const range = maxTron - minTron;
                            const threshold1 = minTron + Math.floor((range * 0.5) / 10000) * 10000;
                            const threshold2 = minTron + Math.floor((range * 0.8) / 10000) * 10000;
                            
                            return `
                            <div class="distribution-preview hidden text-xs bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg mt-2 border border-blue-200">
                                <div class="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                    <span>📊</span>
                                    <span>Phân bố thông minh:</span>
                                </div>
                                <div class="space-y-1.5 pl-1">
                                    <div class="flex items-center gap-2">
                                        <div class="w-20 bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full"></div>
                                        <span class="text-gray-600">
                                            <span class="font-semibold text-green-700">50%</span>: 
                                            <span class="preview-dist-low">${formatVND(minTron)}-${formatVND(threshold1)}</span>
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div class="w-12 bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full"></div>
                                        <span class="text-gray-600">
                                            <span class="font-semibold text-yellow-700">30%</span>: 
                                            <span class="preview-dist-medium">${formatVND(threshold1 + 10000)}-${formatVND(threshold2)}</span>
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 bg-gradient-to-r from-red-400 to-red-500 h-2 rounded-full"></div>
                                        <span class="text-gray-600">
                                            <span class="font-semibold text-red-700">20%</span>: 
                                            <span class="preview-dist-high">${formatVND(threshold2 + 10000)}-${formatVND(maxTron)}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            `;
                        })()}
                        
                        <!-- Advanced Options -->
                        <div class="advanced-options hidden mt-3 pt-3 border-t border-gray-200">
                            <h4 class="text-sm font-semibold text-gray-700 mb-2">⚙️ Tùy chỉnh nâng cao</h4>
                            
                            <!-- Áp dụng tùy chirng nâng cao này cho tất cả  -->
                            <label class="form-check-label text-sm mb-2">
                                <input type="checkbox" class="form-check-input text-sm" data-apply="advanced" value="1"> Áp dụng cho tất cả 
                            </label>

                            <!-- Số lượng bao đặc biệt -->
                            <div class="bg-blue-50 p-3 rounded-lg space-y-2">
                                <div class="flex items-center justify-between">
                                    <label class="text-xs text-gray-600">
                                        Số lượng bao có mệnh giá <strong class="special-amount-display">${formatVND(initialSpecialAmount)}</strong>
                                    </label>
                                    <div class="flex items-center gap-2">
                                        <button class="decrease-special bg-gray-300 hover:bg-gray-400 w-6 h-6 rounded text-sm font-bold">-</button>
                                        <input type="number" 
                                            data-recipient="${key}"
                                            data-field="special-count"
                                            value="${initialSpecialCount}"
                                            min="0"
                                            max="${TOTAL_ENVELOPES}"
                                            class="special-count-input w-12 text-center border border-gray-300 rounded py-1 text-sm">
                                        <button class="increase-special bg-gray-300 hover:bg-gray-400 w-6 h-6 rounded text-sm font-bold">+</button>
                                    </div>
                                </div>
                                <div class="text-xs text-gray-500 italic">
                                    <span class="special-preview">${initialPreviewText}</span>
                                </div>
                            </div>
                            
                            <!-- Thêm mệnh giá đặc biệt khác -->
                            <div class="mt-3">
                                <button class="add-custom-special w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white text-xs font-semibold py-2 px-3 rounded-lg transition flex items-center justify-center gap-2">
                                    <span>✨</span>
                                    <span>Thêm mệnh giá đặc biệt khác</span>
                                </button>
                            </div>
                            
                            <!-- Container cho các mệnh giá đặc biệt tùy chỉnh -->
                            <div class="custom-specials-container mt-2 space-y-2">
                                <!-- Các mệnh giá đặc biệt sẽ được thêm vào đây -->
                            </div>

                            <!-- Tổng kết -->
                            <div class="mt-3 p-2 bg-green-50 rounded border border-green-200">
                                <div class="text-xs text-green-700">
                                    <div class="font-semibold mb-1">📊 Phân bố ${TOTAL_ENVELOPES} bao lì xì:</div>
                                    <div class="pl-3 space-y-1">
                                        <div>• <span class="normal-count-preview">${initialNormalCount} bao</span> thường: <span class="preview-min">${formatVND(settings.min)}</span> - <span class="preview-max">${formatVND(settings.max)}</span></div>
                                        <div class="special-count-preview-list">
                                            ${initialSpecialListHTML}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;


        container.appendChild(card);

        // Load custom specials nếu có
        if (settings.customSpecials && settings.customSpecials.length > 0) {
            const customContainer = card.querySelector('.custom-specials-container');

            settings.customSpecials.forEach((custom, index) => {
                const customId = Date.now() + index;
                const customHTML = `
                            <div class="custom-special-item bg-purple-50 p-3 rounded-lg border-2 border-purple-200" data-custom-id="${customId}">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-xs font-semibold text-purple-700">Mệnh giá đặc biệt #${index + 1}</span>
                                    <button class="remove-custom-special text-red-500 hover:text-red-700 text-lg font-bold leading-none" title="Xóa">×</button>
                                </div>
                                <div class="mb-2">
                                    <label class="text-xs text-gray-600 block mb-1">Mệnh giá (VND)</label>
                                    <input type="text" 
                                        class="custom-special-amount w-full px-2 py-1 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                        data-custom-id="${customId}"
                                        inputmode="numeric"
                                        value="${formatNumberInput(custom.amount.toString())}"
                                        placeholder="500.000">
                                </div>
                                <div>
                                    <label class="text-xs text-gray-600 block mb-1">Số lượng bao</label>
                                    <div class="flex items-center gap-2">
                                        <button class="decrease-custom-special bg-gray-300 hover:bg-gray-400 w-6 h-6 rounded text-sm font-bold">-</button>
                                        <input type="number" 
                                            class="custom-special-count w-12 text-center border border-gray-300 rounded py-1 text-sm"
                                            data-custom-id="${customId}"
                                            value="${custom.count}"
                                            min="0"
                                            max="${TOTAL_ENVELOPES}">
                                        <button class="increase-custom-special bg-gray-300 hover:bg-gray-400 w-6 h-6 rounded text-sm font-bold">+</button>
                                    </div>
                                </div>
                                <div class="text-xs text-purple-600 italic mt-2 custom-special-preview">
                                    ${custom.count} bao sẽ có mệnh giá ${formatVND(custom.amount)} 🎉
                                </div>
                            </div>
                        `;
                customContainer.insertAdjacentHTML('beforeend', customHTML);
            });
        }

    });

    // Real-time update preview khi nhập
    // Real-time update preview khi nhập (CHỈ FORMAT & UPDATE PREVIEW)
    container.querySelectorAll('input').forEach(input => {
        // Event: input - CHỈ format số và update preview
        input.addEventListener('input', function (e) {
            // Lưu vị trí con trỏ
            const cursorPosition = this.selectionStart;
            const oldLength = this.value.length;

            // Format input
            const rawValue = this.value;
            const formattedValue = formatNumberInput(rawValue);
            this.value = formattedValue;

            // Điều chỉnh lại vị trí con trỏ sau khi format
            const newLength = formattedValue.length;
            const lengthDiff = newLength - oldLength;
            this.selectionStart = this.selectionEnd = cursorPosition + lengthDiff;

            // Update preview (CHỈ hiển thị, KHÔNG validate)
            const card = this.closest('.setting-card');
            if (!card) return;
            
            const minInput = card.querySelector('[data-field="min"]');
            const maxInput = card.querySelector('[data-field="max"]');
            const previewMin = card.querySelector('.preview-min');
            const previewMax = card.querySelector('.preview-max');

            const minValue = parseNumberInput(minInput.value);
            const maxValue = parseNumberInput(maxInput.value);

            // CHỈ format preview, KHÔNG auto-adjust
            if (previewMin) previewMin.textContent = formatVND(minValue);
            if (previewMax) previewMax.textContent = formatVND(maxValue);
            
            // ✨ THÊM: Update distribution preview
            updateDistributionPreview(card);
        });
        
        // ✅ THÊM EVENT MỚI: blur - Validate khi rời khỏi ô input
        input.addEventListener('blur', function (e) {
            const card = this.closest('.setting-card');
            if (!card) return;
            
            const field = this.dataset.field;
            
            // Chỉ validate cho min/max
            if (field === 'min' || field === 'max') {
                validateMinMax(card);
            }
        });
    });



}
// ===== end Form =====


// Gọi hàm khi mở modal
settingsBtn.addEventListener('click', function () {
    generateSettingsForm(); // Generate form trước
    settingsModal.classList.remove('hidden');
});

// ===== EVENT DELEGATION (chỉ gắn 1 lần) =====
let isEventDelegationSetup = false;

if (!isEventDelegationSetup) {
    const container = document.getElementById('settings-form-container');

    // Xử lý tất cả click trong container
    container.addEventListener('click', function (e) {
        // Apply 'special amount' to all cards when checkbox toggled
        const applySpecialEl = e.target.closest('input.form-check-input[data-apply="special"]');
        if (applySpecialEl) {
            const checked = applySpecialEl.checked;
            const card = applySpecialEl.closest('.setting-card');
            if (checked && card) {
                const ok = confirm('Bạn có chắc muốn áp dụng mệnh giá đặc biệt này cho tất cả các loại?');
                if (!ok) {
                    applySpecialEl.checked = false;
                    return;
                }

                const val = card.querySelector('.setting-input-special-amount')?.value || '';
                container.querySelectorAll('.setting-card').forEach(c => {
                    if (c === card) return;
                    const inp = c.querySelector('.setting-input-special-amount');
                    if (inp) inp.value = val;
                    const disp = c.querySelector('.special-amount-display');
                    if (disp) disp.textContent = formatVND(parseNumberInput(val));
                    updateSpecialPreview(c);
                });
            } else if (!checked) {
                // Nếu uncheck, không làm gì thêm (nguồn giữ nguyên)
            }
            return;
        }

        // Apply advanced (special-count) to all cards when checkbox toggled
        const applyAdvEl = e.target.closest('input.form-check-input[data-apply="advanced"]');
        if (applyAdvEl) {
            const checked = applyAdvEl.checked;
            const card = applyAdvEl.closest('.setting-card');
            if (checked && card) {
                const ok = confirm('Bạn có muốn áp dụng số lượng bao đặc biệt này cho tất cả các loại?');
                if (!ok) {
                    applyAdvEl.checked = false;
                    return;
                }

                const sc = card.querySelector('.special-count-input')?.value || '0';
                container.querySelectorAll('.setting-card').forEach(c => {
                    if (c === card) return;
                    const scInp = c.querySelector('.special-count-input');
                    if (scInp) scInp.value = sc;
                    updateSpecialPreview(c);
                });
            }
            return;
        }

        // ✨ THÊM: Toggle distribution preview
        if (e.target.closest('.toggle-distribution')) {
            const btn = e.target.closest('.toggle-distribution');
            const card = btn.closest('.setting-card');
            const distributionPreview = card.querySelector('.distribution-preview');
            
            if (distributionPreview) {
                if (distributionPreview.classList.contains('hidden')) {
                    // Hiện
                    distributionPreview.classList.remove('hidden');
                    btn.innerHTML = 'Thể lệ ▲';
                    
                    // Animation fade in
                    distributionPreview.style.opacity = '0';
                    distributionPreview.style.maxHeight = '0';
                    distributionPreview.style.overflow = 'hidden';
                    distributionPreview.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        distributionPreview.style.opacity = '1';
                        distributionPreview.style.maxHeight = '200px';
                    }, 10);
                } else {
                    // Ẩn
                    distributionPreview.style.opacity = '0';
                    distributionPreview.style.maxHeight = '0';
                    
                    setTimeout(() => {
                        distributionPreview.classList.add('hidden');
                        btn.innerHTML = 'Thể lệ ▼';
                        distributionPreview.style.maxHeight = '';
                        distributionPreview.style.overflow = '';
                    }, 300);
                }
            }
            return;
        }
        
        // Toggle advanced options
        if (e.target.closest('.toggle-advanced')) {
            const toggleBtn = e.target.closest('.toggle-advanced');
            const card = toggleBtn.closest('.setting-card');
            const advancedOptions = card.querySelector('.advanced-options');
            const svg = toggleBtn.querySelector('svg');

            if (advancedOptions.classList.contains('hidden')) {
                advancedOptions.classList.remove('hidden');
                svg.style.transform = 'rotate(180deg)';
                svg.style.transition = 'transform 0.3s ease';
            } else {
                advancedOptions.classList.add('hidden');
                svg.style.transform = 'rotate(0deg)';
            }
            return; // Dừng xử lý các event khác
        }

        // Nút giảm
        if (e.target.closest('.decrease-special')) {
            const btn = e.target.closest('.decrease-special');
            const input = btn.parentElement.querySelector('.special-count-input');
            const currentValue = parseInt(input.value) || 0;
            if (currentValue > 0) {
                input.value = currentValue - 1;
                updateSpecialPreview(btn.closest('.setting-card'));
            }
        }

        // Nút tăng
        if (e.target.closest('.increase-special')) {
            const btn = e.target.closest('.increase-special');
            const input = btn.parentElement.querySelector('.special-count-input');
            const currentValue = parseInt(input.value) || 0;
            if (currentValue < TOTAL_ENVELOPES) {
                input.value = currentValue + 1;
                updateSpecialPreview(btn.closest('.setting-card'));
            }
        }

        // Nút "Thêm mệnh giá đặc biệt khác"
        if (e.target.closest('.add-custom-special')) {
            e.preventDefault();
            const btn = e.target.closest('.add-custom-special');
            const card = btn.closest('.setting-card');
            const container = card.querySelector('.custom-specials-container');

            // Tạo ID unique cho custom special mới
            const customId = Date.now();
            // Lấy giá trị special amount hiện tại làm mặc định
            // Lấy giá trị special amount hiện tại
            const currentSpecialAmountValue = parseNumberInput(card.querySelector('[data-field="special-amount"]').value) || 500000;

            // Tìm giá trị cao nhất trong các custom đã có
            const existingCustoms = card.querySelectorAll('.custom-special-item');
            let maxExistingAmount = currentSpecialAmountValue;

            existingCustoms.forEach(item => {
                const amt = parseNumberInput(item.querySelector('.custom-special-amount').value);
                if (amt > maxExistingAmount) maxExistingAmount = amt;
            });

            // Tăng lên 50k từ giá trị cao nhất 
            const newSpecialAmount = Math.round(maxExistingAmount * 2);

            // Format lại
            const currentSpecialAmount = formatNumberInput(newSpecialAmount.toString());


            // Tạo HTML cho custom special
            const customSpecialHTML = `
                        <div class="custom-special-item bg-purple-50 p-3 rounded-lg border-2 border-purple-200" data-custom-id="${customId}">
                            <!-- Nút xóa -->
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-semibold text-purple-700">Mệnh giá đặc biệt #${(container?.children?.length || 0) + 1}</span>
                                <button class="remove-custom-special text-red-500 hover:text-red-700 text-lg font-bold leading-none" title="Xóa">×</button>
                            </div>
                            
                            <!-- Input mệnh giá -->
                            <div class="mb-2">
                                <label class="text-xs text-gray-600 block mb-1">Mệnh giá (VND)</label>
                                <input type="text" 
                                    class="custom-special-amount w-full px-2 py-1 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    data-custom-id="${customId}"
                                    inputmode="numeric"
                                    value="${currentSpecialAmount}"
                                    placeholder="500.000">
                            </div>
                            
                            <!-- Số lượng bao -->
                            <div>
                                <label class="text-xs text-gray-600 block mb-1">Số lượng bao</label>
                                <div class="flex items-center gap-2">
                                    <button class="decrease-custom-special bg-gray-300 hover:bg-gray-400 w-6 h-6 rounded text-sm font-bold">-</button>
                                    <input type="number" 
                                        class="custom-special-count w-12 text-center border border-gray-300 rounded py-1 text-sm"
                                        data-custom-id="${customId}"
                                        value="1"
                                        min="0"
                                        max="${TOTAL_ENVELOPES}">
                                    <button class="increase-custom-special bg-gray-300 hover:bg-gray-400 w-6 h-6 rounded text-sm font-bold">+</button>
                                </div>
                            </div>
                            
                            <!-- Preview -->
                            <div class="text-xs text-purple-600 italic mt-2 custom-special-preview">
                                1 bao sẽ có mệnh giá 0đ 🎉
                            </div>
                        </div>
                    `;

            // Thêm vào container
            container.insertAdjacentHTML('beforeend', customSpecialHTML);

            // Update tổng kết
            updateSpecialPreview(card);
        }


        // Nút xóa custom special
        if (e.target.closest('.remove-custom-special')) {
            const btn = e.target.closest('.remove-custom-special');
            const item = btn.closest('.custom-special-item');
            const card = btn.closest('.setting-card');

            if (confirm('Bạn có chắc muốn xóa mệnh giá đặc biệt này?')) {
                item.remove();

                // Cập nhật lại số thứ tự
                const container = card.querySelector('.custom-specials-container');
                container.querySelectorAll('.custom-special-item').forEach((item, index) => {
                    item.querySelector('span.text-xs.font-semibold').textContent = `Mệnh giá đặc biệt #${index + 1}`;
                });

                // Update tổng kết
                updateSpecialPreview(card);
            }
        }

        // Nút giảm custom special
        if (e.target.closest('.decrease-custom-special')) {
            const btn = e.target.closest('.decrease-custom-special');
            const input = btn.parentElement.querySelector('.custom-special-count');
            const currentValue = parseInt(input.value) || 0;
            if (currentValue > 0) {
                input.value = currentValue - 1;
                updateCustomSpecialPreview(btn.closest('.custom-special-item'));
                updateSpecialPreview(btn.closest('.setting-card'));
            }
        }

        // Nút tăng custom special
        if (e.target.closest('.increase-custom-special')) {
            const btn = e.target.closest('.increase-custom-special');
            const input = btn.parentElement.querySelector('.custom-special-count');
            const currentValue = parseInt(input.value) || 0;
            if (currentValue < TOTAL_ENVELOPES) {
                input.value = currentValue + 1;
                updateCustomSpecialPreview(btn.closest('.custom-special-item'));
                updateSpecialPreview(btn.closest('.setting-card'));
            }
        }

    });

    // Xử lý input
    container.addEventListener('input', function (e) {
        if (e.target.classList.contains('special-count-input')) {
            let value = parseInt(e.target.value) || 0;
            if (value < 0) value = 0;
            if (value > TOTAL_ENVELOPES) value = TOTAL_ENVELOPES;
            e.target.value = value;
            updateSpecialPreview(e.target.closest('.setting-card'));
        }

        // MỚI: Xử lý khi thay đổi special amount
        if (e.target.classList.contains('setting-input-special-amount')) {
            const card = e.target.closest('.setting-card');
            const input = e.target;

            // Lưu vị trí con trỏ và giá trị cũ
            const cursorPosition = input.selectionStart;
            const oldValue = input.value;

            // Format input
            const rawValue = input.value;
            const formattedValue = formatNumberInput(rawValue);

            // Chỉ update nếu giá trị thay đổi
            if (formattedValue !== oldValue) {
                input.value = formattedValue;

                // Tính toán vị trí cursor mới dựa trên số dấu chấm
                const dotsBeforeCursorOld = (oldValue.substring(0, cursorPosition).match(/\./g) || []).length;
                const dotsBeforeCursorNew = (formattedValue.substring(0, cursorPosition).match(/\./g) || []).length;

                const dotsDiff = dotsBeforeCursorNew - dotsBeforeCursorOld;
                let newCursorPosition = cursorPosition + dotsDiff;

                newCursorPosition = Math.max(0, Math.min(newCursorPosition, formattedValue.length));

                input.selectionStart = input.selectionEnd = newCursorPosition;
            }

            // Update preview
            updateSpecialPreview(card);
        }

        // Xử lý custom special amount input
        if (e.target.classList.contains('custom-special-amount')) {
            const input = e.target;
            const item = input.closest('.custom-special-item');
            const card = input.closest('.setting-card');

            // Lưu vị trí con trỏ và giá trị cũ
            const cursorPosition = input.selectionStart;
            const oldValue = input.value;

            // Format input
            const rawValue = input.value;
            const formattedValue = formatNumberInput(rawValue);

            // Chỉ update nếu giá trị thay đổi
            if (formattedValue !== oldValue) {
                input.value = formattedValue;

                // Tính toán vị trí cursor mới
                // Đếm số dấu chấm trước cursor
                const dotsBeforeCursorOld = (oldValue.substring(0, cursorPosition).match(/\./g) || []).length;
                const dotsBeforeCursorNew = (formattedValue.substring(0, cursorPosition).match(/\./g) || []).length;

                // Điều chỉnh cursor dựa trên số dấu chấm thay đổi
                const dotsDiff = dotsBeforeCursorNew - dotsBeforeCursorOld;
                let newCursorPosition = cursorPosition + dotsDiff;

                // Đảm bảo cursor không vượt quá độ dài
                newCursorPosition = Math.max(0, Math.min(newCursorPosition, formattedValue.length));

                input.selectionStart = input.selectionEnd = newCursorPosition;
            }

            // Update preview của custom special này
            updateCustomSpecialPreview(item);

            // Update tổng kết
            updateSpecialPreview(card);
        }

        // Xử lý custom special count input
        if (e.target.classList.contains('custom-special-count')) {
            let value = parseInt(e.target.value) || 0;
            if (value < 0) value = 0;
            if (value > TOTAL_ENVELOPES) value = TOTAL_ENVELOPES;
            e.target.value = value;

            const item = e.target.closest('.custom-special-item');
            const card = e.target.closest('.setting-card');

            updateCustomSpecialPreview(item);
            updateSpecialPreview(card);
        }

    });

    isEventDelegationSetup = true;
}

// Hàm cập nhật preview (di chuyển ra ngoài để dùng chung)
function updateSpecialPreview(card) {
    const specialCount = parseInt(card.querySelector('.special-count-input').value) || 0;
    const specialAmount = parseNumberInput(card.querySelector('[data-field="special-amount"]').value);
    const maxValue = parseNumberInput(card.querySelector('[data-field="max"]').value);

    const preview = card.querySelector('.special-preview');
    const specialAmountDisplay = card.querySelector('.special-amount-display');

    // Update display của special amount
    if (specialAmountDisplay) {
        specialAmountDisplay.textContent = formatVND(specialAmount);
    }

    // Update preview text
    if (specialCount === 0) {
        preview.textContent = `0 bao sẽ có mệnh giá ${formatVND(specialAmount)}`;
    } else if (specialCount === 1) {
        preview.textContent = `1 bao sẽ có mệnh giá ${formatVND(specialAmount)} 🎉`;
    } else {
        preview.textContent = `${specialCount} bao sẽ có mệnh giá ${formatVND(specialAmount)} 🎉`;
    }

    // Cập nhật phân bố tổng quát
    // Tính tổng số bao đặc biệt (bao chính + custom)
    let totalSpecialCount = specialCount;

    // Lấy tất cả custom specials
    const customSpecials = card.querySelectorAll('.custom-special-item');
    const customSpecialsList = [];

    customSpecials.forEach(item => {
        const amount = parseNumberInput(item.querySelector('.custom-special-amount').value);
        const count = parseInt(item.querySelector('.custom-special-count').value) || 0;

        totalSpecialCount += count;

        if (count > 0) {
            customSpecialsList.push({ amount, count });
        }
    });

    // Cập nhật số bao thường
    const normalCount = TOTAL_ENVELOPES - totalSpecialCount;
    card.querySelector('.normal-count-preview').textContent = `${normalCount} bao`;

    // Hiển thị danh sách đặc biệt
    const specialList = card.querySelector('.special-count-preview-list');
    let specialHTML = '';

    // Bao đặc biệt chính
    if (specialCount > 0) {
        specialHTML += `<div>• <span class="font-semibold text-yellow-600">${specialCount} bao ĐẶC BIỆT</span>: ${formatVND(specialAmount)} 🌟</div>`;
    }

    // Các bao custom
    customSpecialsList.forEach((custom, index) => {
        specialHTML += `<div>• <span class="font-semibold text-purple-600">${custom.count} bao ĐẶC BIỆT #${index + 2}</span>: ${formatVND(custom.amount)} 💎</div>`;
    });

    specialList.innerHTML = specialHTML;

    // Cảnh báo nếu tổng vượt quá limit
    if (totalSpecialCount > TOTAL_ENVELOPES) {
        specialList.innerHTML += `<div class="text-red-600 font-bold mt-1">⚠️ Tổng số bao đặc biệt vượt quá ${TOTAL_ENVELOPES}!</div>`;
    }
}
// ================================================

// Hàm cập nhật preview cho custom special item
function updateCustomSpecialPreview(item) {
    const amountInput = item.querySelector('.custom-special-amount');
    const countInput = item.querySelector('.custom-special-count');
    const preview = item.querySelector('.custom-special-preview');

    const amount = parseNumberInput(amountInput.value);
    const count = parseInt(countInput.value) || 0;

    if (count === 0) {
        preview.textContent = `0 bao sẽ có mệnh giá ${formatVND(amount)}`;
    } else if (count === 1) {
        preview.textContent = `1 bao sẽ có mệnh giá ${formatVND(amount)} 🎉`;
    } else {
        preview.textContent = `${count} bao sẽ có mệnh giá ${formatVND(amount)} 🎉`;
    }
}


// Đóng modal
closeSettings.addEventListener('click', function () {
    settingsModal.classList.add('hidden');
});

// Đóng khi click overlay
settingsModal.addEventListener('click', function (e) {
    if (e.target === this) {
        this.classList.add('hidden');
    }
});

// Lưu cài đặt
saveSettings.addEventListener('click', function () {
    // Reset tất cả error states
    document.querySelectorAll('.card-error-message').forEach(el => el.remove());
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('border-red-500', 'bg-red-50');
    });
    
    // ✅ VALIDATE TẤT CẢ CÁC CARD
    let hasError = false;
    let errorCards = [];
    
    document.querySelectorAll('.setting-card').forEach(card => {
        const isValid = validateMinMax(card, true); // showAlert = true
        if (!isValid) {
            hasError = true;
            const recipientKey = card.dataset.recipient;
            const recipientName = recipientNames[recipientKey] || recipientKey;
            errorCards.push(recipientName);
        }
    });
    
    if (hasError) {
        // Scroll đến card lỗi đầu tiên
        const firstErrorCard = document.querySelector('.setting-card input.border-red-500')?.closest('.setting-card');
        if (firstErrorCard) {
            firstErrorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Alert tổng hợp
        const errorList = errorCards.join(', ');
        alert(`⚠️ Vui lòng kiểm tra lại:\n\n${errorList}\n\nCác ô nhập liệu bị lỗi đã được đánh dấu màu đỏ.`);
        return;
    }
    
    // Thu thập settings (chỉ chạy khi đã validate OK)
    const settings = {};

    document.querySelectorAll('.setting-card').forEach(card => {
        const recipient = card.dataset.recipient;

        const minValue     = parseNumberInput(card.querySelector('[data-field="min"]').value);
        const maxValue     = parseNumberInput(card.querySelector('[data-field="max"]').value);
        const specialAmount = parseNumberInput(card.querySelector('[data-field="special-amount"]').value);
        const specialCount  = parseInt(card.querySelector('.special-count-input')?.value || 0);

        settings[recipient] = {
            min: minValue,
            max: maxValue,
            specialAmount: specialAmount,
            specialCount: specialCount
        };

        const customSpecials = [];
        card.querySelectorAll('.custom-special-item').forEach(item => {
            const amount = parseNumberInput(item.querySelector('.custom-special-amount').value);
            const count  = parseInt(item.querySelector('.custom-special-count').value) || 0;
            if (count > 0 && amount > 0) {
                customSpecials.push({ amount, count });
            }
        });

        if (customSpecials.length > 0) {
            settings[recipient].customSpecials = customSpecials;
        }
    });

    // Lưu settings
    localStorage.setItem('envelopeSettings', JSON.stringify(settings));
    console.log('[SAVE] Đã lưu envelopeSettings:', settings);

    // XÓA CACHE
    console.log('[CACHE CLEAR] Bắt đầu xóa cache...');
    let clearedCount = 0;
    Object.keys(recipientNames).forEach(key => {
        const cacheKey = `envelopeAmounts_${key}`;
        if (localStorage.getItem(cacheKey)) {
            localStorage.removeItem(cacheKey);
            clearedCount++;
            console.log(`[CACHE CLEAR] Đã xóa: ${cacheKey}`);
        }
    });
    console.log(`[CACHE CLEAR] Đã xóa ${clearedCount} bộ cache`);

    // Auto-apply nếu đang ở màn hình lì xì
    const envelopesContainer = document.getElementById('envelopes-container');
    if (selectedRecipient && envelopesContainer && !envelopesContainer.classList.contains('hidden')) {
        const storageKey = `envelopeAmounts_${selectedRecipient}`;
        const newAmounts = generateFixedAmountsForRecipient(selectedRecipient);
        localStorage.setItem(storageKey, JSON.stringify(newAmounts));

        const envelopesGrid = document.getElementById('envelopes-grid');
        if (envelopesGrid) {
            envelopesGrid.innerHTML = '';
            for (let i = 1; i <= TOTAL_ENVELOPES; i++) {
                const envelope = createEnvelope(i);
                envelope.dataset.fixedAmount = newAmounts[i - 1];
                envelope.dataset.number = i;
                
                // Thêm amount display
                const amountDisplay = document.createElement('div');
                amountDisplay.className = 'amount-display';
                amountDisplay.textContent = new Intl.NumberFormat('vi-VN').format(newAmounts[i - 1]);
                envelope.appendChild(amountDisplay);
                
                envelopesGrid.appendChild(envelope);
            }
            console.log(`[AUTO APPLY] Đã tạo lại bộ mới cho ${selectedRecipient}`);
            alert(`✅ Cài đặt mới đã áp dụng ngay!\nBộ ${TOTAL_ENVELOPES} bao đã được tạo lại.`);
        }
    } else {
        alert('✅ Đã lưu cài đặt thành công!');
    }

    settingsModal.classList.add('hidden');
});

// Reset mặc định
resetSettings.addEventListener('click', function () {
    if (confirm('Bạn có chắc muốn reset tất cả về mặc định (10-50k)?')) {
        localStorage.removeItem('envelopeSettings');
        generateSettingsForm(); // Reload form với giá trị mặc định
        alert('🔄 Đã reset về mặc định!');
    }
});
// ===== END XỬ LÝ MODAL CÀI ĐẶT =====
// <!-- End Setting mệnh giá lì xì -->

// Lấy settings
function getEnvelopeSettingsFor(recipientKey) {
    const saved = localStorage.getItem('envelopeSettings');
    if (!saved) return { ...DEFAULT_ENVELOPE_SETTINGS };

    try {
        const allSettings = JSON.parse(saved);
        const specific = allSettings[recipientKey];

        if (specific) {
            // Có setting riêng → trả về (kết hợp với default nếu thiếu field)
            return {
                min: specific.min ?? DEFAULT_ENVELOPE_SETTINGS.min,
                max: specific.max ?? DEFAULT_ENVELOPE_SETTINGS.max,
                specialAmount: specific.specialAmount ?? DEFAULT_ENVELOPE_SETTINGS.specialAmount,
                specialCount: specific.specialCount ?? DEFAULT_ENVELOPE_SETTINGS.specialCount,
                customSpecials: specific.customSpecials ?? [],
            };
        }
    } catch (e) {
        console.warn("localStorage envelopeSettings bị hỏng, dùng mặc định", e);
    }

    // Không có hoặc lỗi → mặc định
    return { ...DEFAULT_ENVELOPE_SETTINGS };
}
// end Lấy settings

// ===== AUTO-SYNC URL WITH SETTINGS (REAL-TIME) =====

// Hàm encode settings thành URL param
function encodeSettingsToURL(settings) {
    try {
        const json = JSON.stringify(settings);
        const base64 = btoa(unescape(encodeURIComponent(json)));
        return base64;
    } catch (e) {
        console.error('Lỗi encode settings:', e);
        return null;
    }
}

// Hàm decode settings từ URL param
function decodeSettingsFromURL(base64String) {
    try {
        const json = decodeURIComponent(escape(atob(base64String)));
        return JSON.parse(json);
    } catch (e) {
        console.error('Lỗi decode settings từ URL:', e);
        return null;
    }
}

// Hàm update URL (không reload page)
function updateURLWithSettings(settings) {
    const encoded = encodeSettingsToURL(settings);
    if (!encoded) return;
    
    const url = new URL(window.location);
    url.searchParams.set('s', encoded);
    
     // Giữ nguyên param 'name' nếu có
    if (senderName) {
        url.searchParams.set('name', encodeURIComponent(senderName));
    }
    
    // Update URL without reload
    window.history.replaceState({}, '', url);
    
    console.log('[URL SYNC] ✅ URL đã cập nhật');
}

// Hàm thu thập settings từ form hiện tại
function collectCurrentSettings() {
    const settings = {};
    
    document.querySelectorAll('.setting-card').forEach(card => {
        const recipient = card.dataset.recipient;
        
        const minInput = card.querySelector('[data-field="min"]');
        const maxInput = card.querySelector('[data-field="max"]');
        const specialAmountInput = card.querySelector('[data-field="special-amount"]');
        const specialCountInput = card.querySelector('.special-count-input');
        
        if (!minInput || !maxInput || !specialAmountInput || !specialCountInput) return;
        
        const minValue = parseNumberInput(minInput.value);
        const maxValue = parseNumberInput(maxInput.value);
        const specialAmount = parseNumberInput(specialAmountInput.value);
        const specialCount = parseInt(specialCountInput.value) || 0;
        
        settings[recipient] = {
            min: minValue,
            max: maxValue,
            specialAmount: specialAmount,
            specialCount: specialCount
        };
        
        // Custom specials
        const customSpecials = [];
        card.querySelectorAll('.custom-special-item').forEach(item => {
            const amount = parseNumberInput(item.querySelector('.custom-special-amount').value);
            const count = parseInt(item.querySelector('.custom-special-count').value) || 0;
            if (count > 0 && amount > 0) {
                customSpecials.push({ amount, count });
            }
        });
        
        if (customSpecials.length > 0) {
            settings[recipient].customSpecials = customSpecials;
        }
    });
    
    return settings;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Auto-update URL (debounced)
const autoUpdateURL = debounce(() => {
    const settings = collectCurrentSettings();
    updateURLWithSettings(settings);
}, 1000);

// Load settings từ URL khi page load
function loadSettingsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const settingsParam = urlParams.get('s');
    
    if (!settingsParam) return false;
    
    const decodedSettings = decodeSettingsFromURL(settingsParam);
    if (!decodedSettings) {
        console.warn('URL settings không hợp lệ');
        return false;
    }
    
    // Lưu vào localStorage
    localStorage.setItem('envelopeSettings', JSON.stringify(decodedSettings));
    console.log('[URL LOAD] Đã load settings từ URL:', decodedSettings);
    
    // Xóa cache
    Object.keys(recipientNames).forEach(key => {
        localStorage.removeItem(`envelopeAmounts_${key}`);
    });
    
    return true;
}

// Toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Gọi khi page load
window.addEventListener('DOMContentLoaded', function() {
    const loaded = loadSettingsFromURL();
    if (loaded) {
        showToast('🎉 Đã load cài đặt từ link chia sẻ!');
    }
});

// ===== GẮNG AUTO-UPDATE VÀO EVENT DELEGATION HIỆN CÓ =====
// Tìm phần event delegation đã có và thêm auto-update vào đó

// CÁCH 1: Gắn vào event delegation container (đã có sẵn)
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('settings-form-container');
    
    // Gắn listener cho input events
    container.addEventListener('input', function(e) {
        // Kiểm tra xem input có phải là setting field không
        if (e.target.classList.contains('setting-input-min') ||
            e.target.classList.contains('setting-input-max') ||
            e.target.classList.contains('setting-input-special-amount') ||
            e.target.classList.contains('special-count-input') ||
            e.target.classList.contains('custom-special-amount') ||
            e.target.classList.contains('custom-special-count')) {
            
            console.log('[URL SYNC] Input thay đổi, chuẩn bị update URL...');
            autoUpdateURL();
        }
    });
    
    // Gắn listener cho click events
    container.addEventListener('click', function(e) {
        if (e.target.closest('.toggle-advanced') ||
            e.target.closest('.add-custom-special') ||
            e.target.closest('.remove-custom-special') ||
            e.target.closest('.increase-special') ||
            e.target.closest('.decrease-special') ||
            e.target.closest('.increase-custom-special') ||
            e.target.closest('.decrease-custom-special')) {
            
            console.log('[URL SYNC] Click thay đổi settings, chuẩn bị update URL...');
            setTimeout(autoUpdateURL, 200);
        }
    });
    
    console.log('[URL SYNC] ✅ Đã kích hoạt auto-sync URL');
});

// ===== END AUTO-SYNC URL =====
// ===== AUTO-ADD URL PARAM KHI PAGE LOAD =====
window.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra xem URL đã có param 's' chưa
    const urlParams = new URLSearchParams(window.location.search);
    const hasSettingsParam = urlParams.has('s');
    
    if (!hasSettingsParam) {
        // Nếu chưa có → Lấy settings từ localStorage và add vào URL
        const savedSettings = localStorage.getItem('envelopeSettings');
        
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                updateURLWithSettings(settings);
                console.log('[URL SYNC] ✅ Đã thêm param vào URL từ localStorage khi page load');
            } catch (e) {
                console.warn('[URL SYNC] Không thể parse localStorage settings:', e);
            }
        } else {
            // Nếu localStorage cũng chưa có → Dùng default settings
            const defaultSettings = {};
            Object.keys(recipientNames).forEach(key => {
                defaultSettings[key] = { ...DEFAULT_ENVELOPE_SETTINGS };
            });
            updateURLWithSettings(defaultSettings);
            console.log('[URL SYNC] ✅ Đã thêm param vào URL từ default settings khi page load');
        }
    } else {
        console.log('[URL SYNC] URL đã có param, không cần thêm');
    }
});
// ===== END AUTO-ADD URL PARAM =====



// ===== VALIDATE MIN/MAX =====
// ===== VALIDATE MIN/MAX =====
function validateMinMax(card, showAlert = false) {
    const minInput = card.querySelector('[data-field="min"]');
    const maxInput = card.querySelector('[data-field="max"]');
    const previewMin = card.querySelector('.preview-min');
    const previewMax = card.querySelector('.preview-max');
    
    if (!minInput || !maxInput) return true;
    
    const minValue = parseNumberInput(minInput.value);
    const maxValue = parseNumberInput(maxInput.value);
    
    // Giới hạn
    const MAX_MIN_VALUE = 100000000;
    const MAX_MAX_VALUE = 200000000;
    
    let isValid = true;
    let errorMessage = '';
    
    // Reset classes trước
    minInput.classList.remove('border-red-500', 'bg-red-50');
    maxInput.classList.remove('border-red-500', 'bg-red-50');
    
    // 1. Kiểm tra Min không vượt quá giới hạn
    if (minValue > MAX_MIN_VALUE) {
        minInput.value = formatNumberInput(MAX_MIN_VALUE.toString());
        if (previewMin) previewMin.textContent = formatVND(MAX_MIN_VALUE);
        
        errorMessage = `Mệnh giá tối thiểu không được vượt quá ${formatVND(MAX_MIN_VALUE)}`;
        minInput.classList.add('border-red-500', 'bg-red-50');
        isValid = false;
    }
    
    // 2. Kiểm tra Max không vượt quá giới hạn
    if (maxValue > MAX_MAX_VALUE) {
        maxInput.value = formatNumberInput(MAX_MAX_VALUE.toString());
        if (previewMax) previewMax.textContent = formatVND(MAX_MAX_VALUE);
        
        errorMessage = `Mệnh giá tối đa không được vượt quá ${formatVND(MAX_MAX_VALUE)}`;
        maxInput.classList.add('border-red-500', 'bg-red-50');
        isValid = false;
    }
    
    // 3. Kiểm tra Min < Max
    const finalMinValue = parseNumberInput(minInput.value);
    const finalMaxValue = parseNumberInput(maxInput.value);
    
    if (finalMinValue >= finalMaxValue && finalMinValue > 0 && finalMaxValue > 0) {
        errorMessage = `Tối thiểu (${formatVND(finalMinValue)}) phải nhỏ hơn tối đa (${formatVND(finalMaxValue)})`;
        
        // Highlight CẢ HAI ô input
        minInput.classList.add('border-red-500', 'bg-red-50');
        maxInput.classList.add('border-red-500', 'bg-red-50');
        
        isValid = false;
    }
    
    // Hiển thị lỗi
    if (!isValid) {
        if (showAlert) {
            // Khi Save: scroll đến card lỗi + highlight
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Thêm shake animation
            card.classList.add('shake-card');
            setTimeout(() => card.classList.remove('shake-card'), 600);
            
            // Show error message trong card
            showCardError(card, errorMessage);
        } else {
            // Khi blur: chỉ highlight nhẹ
            setTimeout(() => {
                minInput.classList.remove('border-red-500', 'bg-red-50');
                maxInput.classList.remove('border-red-500', 'bg-red-50');
            }, 2000);
        }
    }
    
    return isValid;
}

// Hàm hiển thị error message trong card
function showCardError(card, message) {
    // Xóa error cũ nếu có
    const oldError = card.querySelector('.card-error-message');
    if (oldError) oldError.remove();
    
    // Tạo error message mới
    const errorDiv = document.createElement('div');
    errorDiv.className = 'card-error-message mt-2 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded animate-fade-in';
    errorDiv.innerHTML = `
        <div class="flex items-start gap-2">
            <span class="text-lg">⚠️</span>
            <span>${message}</span>
        </div>
    `;
    
    // Thêm vào sau preview
    const preview = card.querySelector('.text-xs.text-gray-500.bg-gray-50');
    if (preview) {
        preview.insertAdjacentElement('afterend', errorDiv);
    }
    
    // Tự động xóa sau 5s
    setTimeout(() => {
        errorDiv.style.opacity = '0';
        errorDiv.style.transition = 'opacity 0.3s';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}
// ===== END VALIDATE MIN/MAX =====
// ===== END VALIDATE MIN/MAX =====


// ===== UPDATE DISTRIBUTION PREVIEW =====
function updateDistributionPreview(card) {
    const minInput = card.querySelector('[data-field="min"]');
    const maxInput = card.querySelector('[data-field="max"]');
    
    if (!minInput || !maxInput) return;
    
    const minValue = parseNumberInput(minInput.value);
    const maxValue = parseNumberInput(maxInput.value);
    
    // Làm tròn 10k
    const minTron = Math.ceil(minValue / 10000) * 10000;
    const maxTron = Math.floor(maxValue / 10000) * 10000;
    const range = maxTron - minTron;
    
    // Tính các mốc phân chia (tròn 10k)
    const threshold1 = minTron + Math.floor((range * 0.5) / 10000) * 10000; // 50%
    const threshold2 = minTron + Math.floor((range * 0.8) / 10000) * 10000; // 80%
    
    // Update text
    const previewLow = card.querySelector('.preview-dist-low');
    const previewMedium = card.querySelector('.preview-dist-medium');
    const previewHigh = card.querySelector('.preview-dist-high');
    
    if (previewLow) {
        previewLow.textContent = `${formatVND(minTron)}-${formatVND(threshold1)}`;
    }
    if (previewMedium) {
        previewMedium.textContent = `${formatVND(threshold1 + 10000)}-${formatVND(threshold2)}`;
    }
    if (previewHigh) {
        previewHigh.textContent = `${formatVND(threshold2 + 10000)}-${formatVND(maxTron)}`;
    }
}
// ===== END UPDATE DISTRIBUTION PREVIEW =====