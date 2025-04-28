// 当前选中的报告类型
let currentReportType = null;

/**
 * 选择报告类型
 * @param {string} type - 报告类型，可选值：'equipment'（设备故障）、'emergency'（突发事件）、'inspection'（检查汇报）
 */
function selectReportType(type) {
    currentReportType = type;
    
    // 隐藏所有表单
    document.querySelectorAll('.report-type-form').forEach(form => {
        form.style.display = 'none';
    });
    
    // 显示选中的表单
    document.getElementById(type + 'Form').style.display = 'block';
    
    // 显示报告预览区域（包括生成报告和复制报告按钮）
    document.getElementById('reportPreview').style.display = 'block';
}

/**
 * 站名选择切换逻辑
 * 当用户选择手动输入时，隐藏下拉框，显示手动输入框
 */
function handleStationChange() {
    const select = document.getElementById('stationName');
    const manualInput = document.getElementById('stationNameManual');
    if (select.value === 'manual') {
        select.style.display = 'none';
        manualInput.style.display = '';
        manualInput.value = '';
        manualInput.focus();
    } else {
        manualInput.style.display = 'none';
        select.style.display = '';
        saveCommonInfo();
    }
}

/**
 * 手动输入失去焦点时逻辑
 * 如果手动输入框为空，切回下拉框
 */
function handleManualBlur() {
    const select = document.getElementById('stationName');
    const manualInput = document.getElementById('stationNameManual');
    if (!manualInput.value.trim()) {
        // 如果没输入内容，切回下拉框
        manualInput.style.display = 'none';
        select.style.display = '';
        select.value = '';
    } else {
        saveCommonInfo();
    }
}

/**
 * 获取当前站名
 * @returns {string} 当前选中的站名
 */
function getCurrentStationName() {
    const select = document.getElementById('stationName');
    const manualInput = document.getElementById('stationNameManual');
    if (select.value === 'manual') {
        return manualInput.value.trim();
    } else {
        return select.value;
    }
}

/**
 * 格式化日期时间
 * @param {string} dateTimeStr - 日期时间字符串
 * @returns {string} 格式化后的日期时间字符串，格式：YYYY年MM月DD日 HH:MM
 */
function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}

/**
 * 生成报告
 * 根据当前选中的报告类型和站名，生成对应的报告内容
 */
function generateReport() {
    if (!currentReportType) {
        alert('请先选择报告类型');
        return;
    }

    const stationName = getCurrentStationName();
    if (!stationName) {
        alert('请选择站名或手动输入站名');
        return;
    }

    let reportContent = '';

    switch (currentReportType) {
        case 'equipment':
            reportContent = generateEquipmentReport(stationName);
            break;
        case 'emergency':
            reportContent = generateEmergencyReport(stationName);
            break;
        case 'inspection':
            reportContent = generateInspectionReport(stationName);
            break;
    }

    // 显示预览
    document.getElementById('previewContent').textContent = reportContent;
    document.getElementById('reportPreview').style.display = 'block';
}

/**
 * 生成设备故障报告
 * @param {string} stationName - 站名
 * @returns {string} 设备故障报告内容
 */
function generateEquipmentReport(stationName) {
    return `${stationName}站报(设备故障)：
一、发生时间：${formatDateTime(document.getElementById('equipmentTime').value)}
二、发生地点：${document.getElementById('equipmentLocation').value}
三、故障设备：${document.getElementById('equipmentName').value}
四、故障现象：${document.getElementById('equipmentPhenomenon').value}
五、影响情况：${document.getElementById('equipmentImpact').value}
六、处理过程：
${document.getElementById('equipmentProcess').value}
七、当前措施：
${document.getElementById('equipmentMeasures').value}
八、报告人：值班员：${document.getElementById('equipmentReporter').value}（${document.getElementById('equipmentReporterId').value}）
九、审核人：值班站长：${document.getElementById('equipmentReviewer').value}（${document.getElementById('equipmentReviewerId').value}）`;
}

/**
 * 生成突发事件报告
 * @param {string} stationName - 站名
 * @returns {string} 突发事件报告内容
 */
function generateEmergencyReport(stationName) {
    const emergencyData = {
        reporter: document.getElementById('emergencyReporter').value,
        reporterId: document.getElementById('emergencyReporterId').value,
        reviewer: document.getElementById('emergencyReviewer').value,
        reviewerId: document.getElementById('emergencyReviewerId').value,
    };

    return `${stationName}站报（突发事件）：
一、发生时间：${formatDateTime(document.getElementById('emergencyTime').value)}
二、发生地点：${document.getElementById('emergencyLocation').value}
三、事件类型：${document.getElementById('emergencyType').value}
四、事件描述：${document.getElementById('emergencyDescription').value}
五、影响情况：${document.getElementById('emergencyImpact').value}
六、处理过程：
${document.getElementById('emergencyProcess').value}
七、当前状态：
${document.getElementById('emergencyStatus').value}
八、报告人：值班员：${emergencyData.reporter}（${emergencyData.reporterId}）
九、审核人：值班站长：${emergencyData.reviewer}（${emergencyData.reviewerId}）`;
}

/**
 * 生成检查汇报
 * @param {string} stationName - 站名
 * @returns {string} 检查汇报内容
 */
function generateInspectionReport(stationName) {
    const inspectionData = {
        reporter: document.getElementById('inspectionReporter').value,
        reporterId: document.getElementById('inspectionReporterId').value,
        reviewer: document.getElementById('inspectionReviewer').value,
        reviewerId: document.getElementById('inspectionReviewerId').value,
    };

    return `${stationName}站报：
一、检查时间：${formatDateTime(document.getElementById('inspectionTime').value)}
二、检查人员：${document.getElementById('inspectionPersonnel').value}
三、检查内容：
${document.getElementById('inspectionContent').value}
四、检查发现问题：
${document.getElementById('inspectionProblems').value}
五、整改措施：
${document.getElementById('inspectionMeasures').value}
六、报告人：值班员：${inspectionData.reporter}（${inspectionData.reporterId}）
七、审核人：值班站长：${inspectionData.reviewer}（${inspectionData.reviewerId}）`;
}

/**
 * 复制报告到剪贴板
 * 将生成的报告内容复制到用户的剪贴板
 */
function copyToClipboard() {
    const previewContent = document.getElementById('previewContent');
    if (!previewContent.textContent) {
        alert('请先生成报告');
        return;
    }

    navigator.clipboard.writeText(previewContent.textContent)
        .then(() => {
            alert('报告已复制到剪贴板');
        })
        .catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
        });
}

/**
 * 保存常用信息到本地存储
 * 将用户输入的站名保存到localStorage，方便下次使用
 */
function saveCommonInfo() {
    const select = document.getElementById('stationName');
    const manualInput = document.getElementById('stationNameManual');
    if (select.value === 'manual') {
        if (manualInput.value.trim()) {
            localStorage.setItem('stationName', manualInput.value.trim());
            localStorage.setItem('stationNameType', 'manual');
        }
    } else if (select.value) {
        localStorage.setItem('stationName', select.value);
        localStorage.setItem('stationNameType', 'select');
    }
}

/**
 * 加载常用信息
 * 从localStorage加载用户之前保存的站名信息
 */
function loadCommonInfo() {
    const savedStationName = localStorage.getItem('stationName');
    const savedType = localStorage.getItem('stationNameType');
    const select = document.getElementById('stationName');
    const manualInput = document.getElementById('stationNameManual');
    if (savedType === 'manual' && savedStationName) {
        select.value = 'manual';
        select.style.display = 'none';
        manualInput.style.display = '';
        manualInput.value = savedStationName;
    } else if (savedType === 'select' && savedStationName) {
        select.value = savedStationName;
        select.style.display = '';
        manualInput.style.display = 'none';
    } else {
        select.value = '';
        select.style.display = '';
        manualInput.style.display = 'none';
    }
}

// 页面加载时加载常用信息
document.addEventListener('DOMContentLoaded', loadCommonInfo);

// 保存常用信息
document.getElementById('stationName').addEventListener('change', saveCommonInfo);
document.getElementById('stationNameManual').addEventListener('input', saveCommonInfo); 