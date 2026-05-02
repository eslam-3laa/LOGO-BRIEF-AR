// =============================================
// ملف تصميم الشعار — السكريبت
// =============================================

let currentPage = 1;
const uploadedImages = [null, null, null, null, null];

// ---- التنقل بين الصفحات ----
function goToPage(num) {
  const current = document.getElementById(`page${currentPage}`);
  const next = document.getElementById(`page${num}`);

  current.classList.add('exit');
  setTimeout(() => {
    current.classList.remove('active', 'exit');
    current.style.display = 'none';
    currentPage = num;

    next.style.display = 'flex';
    void next.offsetWidth;
    next.classList.add('active');

    updateStepIndicator(num);
    window.scrollTo(0, 0);

    if (num === 4) buildSummary();
  }, 350);
}

function updateStepIndicator(active) {
  const dots = document.querySelectorAll('.step-dot');
  const lines = document.querySelectorAll('.step-line');

  dots.forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i + 1 < active) dot.classList.add('done');
    if (i + 1 === active) dot.classList.add('active');
  });

  lines.forEach((line, i) => {
    line.classList.remove('done');
    if (i + 1 < active) line.classList.add('done');
  });
}

// ---- التحقق من الإدخال ----
function validateAndNext(fromPage, toPage) {
  if (fromPage === 2) {
    const required = [
      { id: 'clientName', label: 'اسم العميل' },
      { id: 'phone', label: 'رقم الهاتف' },
      { id: 'email', label: 'البريد الإلكتروني' },
      { id: 'projectName', label: 'اسم المشروع' },
      { id: 'projectType', label: 'نوع المشروع' },
    ];

    for (const field of required) {
      const el = document.getElementById(field.id);
      if (!el.value.trim()) {
        showToast(`يرجى تعبئة: ${field.label}`);
        el.focus();
        el.style.borderColor = '#c0392b';
        setTimeout(() => el.style.borderColor = '', 2000);
        return;
      }
    }

    const email = document.getElementById('email').value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
  }

  if (fromPage === 3) {
    const deadline = document.getElementById('deadline').value;
    if (!deadline) {
      showToast('يرجى تحديد الموعد النهائي');
      return;
    }
    const budget = document.querySelector('input[name="budget"]:checked');
    if (!budget) {
      showToast('يرجى اختيار ميزانية المشروع');
      return;
    }
  }

  goToPage(toPage);
}

// ---- معالجة الرفع ----
function triggerUpload(index) {
  const box = document.querySelector(`.upload-box[data-index="${index}"]`);
  const input = box.querySelector('input[type="file"]');
  input.click();
}

function handleUpload(input, index) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    uploadedImages[index] = dataUrl;

    const box = document.querySelector(`.upload-box[data-index="${index}"]`);
    const preview = box.querySelector('.upload-preview');
    const placeholder = box.querySelector('.upload-placeholder');
    const removeBtn = box.querySelector('.upload-remove');

    preview.src = dataUrl;
    preview.style.display = 'block';
    placeholder.style.display = 'none';
    removeBtn.style.display = 'flex';
    box.classList.add('has-image');
  };
  reader.readAsDataURL(file);
}

function removeUpload(event, index) {
  event.stopPropagation();
  uploadedImages[index] = null;

  const box = document.querySelector(`.upload-box[data-index="${index}"]`);
  const preview = box.querySelector('.upload-preview');
  const placeholder = box.querySelector('.upload-placeholder');
  const removeBtn = box.querySelector('.upload-remove');
  const input = box.querySelector('input[type="file"]');

  preview.src = '';
  preview.style.display = 'none';
  placeholder.style.display = 'flex';
  removeBtn.style.display = 'none';
  box.classList.remove('has-image');
  input.value = '';
}

// ---- السحب والإفلات ----
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.upload-box').forEach((box) => {
    box.addEventListener('dragover', (e) => {
      e.preventDefault();
      box.style.borderColor = 'var(--gold)';
      box.style.background = 'var(--gold-dim)';
    });
    box.addEventListener('dragleave', () => {
      box.style.borderColor = '';
      box.style.background = '';
    });
    box.addEventListener('drop', (e) => {
      e.preventDefault();
      box.style.borderColor = '';
      box.style.background = '';
      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      const index = parseInt(box.dataset.index);
      const input = box.querySelector('input[type="file"]');
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      handleUpload(input, index);
    });
  });
});

// ---- بناء الملخص ----
function getChecked(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)]
    .map(el => el.value).join('، ') || '—';
}

function getRadio(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : '—';
}

function buildSummary() {
  const data = [
    { label: 'اسم العميل', value: document.getElementById('clientName').value || '—' },
    { label: 'الموقع الإلكتروني', value: document.getElementById('website').value || '—' },
    { label: 'رقم الهاتف', value: document.getElementById('phone').value || '—' },
    { label: 'البريد الإلكتروني', value: document.getElementById('email').value || '—' },
    { label: 'اسم المشروع', value: document.getElementById('projectName').value || '—' },
    { label: 'نوع المشروع', value: document.getElementById('projectType').value || '—' },
    { label: 'الجمهور المستهدف', value: getChecked('audience') },
    { label: 'الألوان المفضلة', value: document.getElementById('colours').value || '—' },
    { label: 'نوع الشعار', value: getRadio('logoType') },
    { label: 'استخدامات الشعار', value: getChecked('apps') },
    { label: 'الموعد النهائي', value: document.getElementById('deadline').value || '—' },
    { label: 'ميزانية المشروع', value: getRadio('budget') },
    { label: 'وصف المشروع', value: document.getElementById('aboutProject').value || '—', full: true },
  ];

  const container = document.getElementById('summaryData');
  container.innerHTML = '';

  data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'summary-item' + (item.full ? ' full-width' : '');
    div.innerHTML = `
      <div class="summary-label">${item.label}</div>
      <div class="summary-value">${escapeHtml(item.value)}</div>
    `;
    container.appendChild(div);
  });

  const imgs = uploadedImages.filter(Boolean);
  if (imgs.length > 0) {
    const div = document.createElement('div');
    div.className = 'summary-item full-width';
    div.innerHTML = `
      <div class="summary-label">صور المراجع (${imgs.length})</div>
      <div class="summary-images">
        ${imgs.map(src => `<img src="${src}" alt="مرجع" />`).join('')}
      </div>
    `;
    container.appendChild(div);
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---- توليد PDF (Canvas API — يدعم العربية بالكامل) ----
async function generatePDF() {
  const btn = document.querySelector('.btn-send');
  btn.textContent = 'جاري التوليد...';
  btn.disabled = true;

  try {
    const { jsPDF } = window.jspdf;

    const fields = [
      { label: 'اسم العميل',        value: document.getElementById('clientName').value || '—' },
      { label: 'الموقع الإلكتروني', value: document.getElementById('website').value    || '—' },
      { label: 'رقم الهاتف',        value: document.getElementById('phone').value      || '—' },
      { label: 'البريد الإلكتروني', value: document.getElementById('email').value      || '—' },
      { label: 'اسم المشروع',       value: document.getElementById('projectName').value|| '—' },
      { label: 'نوع المشروع',       value: document.getElementById('projectType').value|| '—' },
      { label: 'الجمهور المستهدف',  value: getChecked('audience') },
      { label: 'الألوان المفضلة',   value: document.getElementById('colours').value    || '—' },
      { label: 'نوع الشعار',        value: getRadio('logoType') },
      { label: 'استخدامات الشعار',  value: getChecked('apps') },
      { label: 'الموعد النهائي',    value: document.getElementById('deadline').value   || '—' },
      { label: 'ميزانية المشروع',   value: getRadio('budget') },
      { label: 'وصف المشروع',       value: document.getElementById('aboutProject').value || '—' },
    ];

    const PW = 1240;
    const PH = 1754;
    const MARGIN = 80;
    const CONTENT_W = PW - MARGIN * 2;

    function wrapText(ctx, text, maxWidth) {
      const words = text.split(' ');
      const lines = [];
      let current = '';
      for (const word of words) {
        const test = current ? current + ' ' + word : word;
        if (ctx.measureText(test).width > maxWidth && current) {
          lines.push(current);
          current = word;
        } else {
          current = test;
        }
      }
      if (current) lines.push(current);
      return lines.length ? lines : [''];
    }

    function measurePageHeight() {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = PW;
      tempCanvas.height = 10;
      const tc = tempCanvas.getContext('2d');
      let y = 140;
      y += 60;
      fields.forEach(f => {
        tc.font = 'bold 26px Cairo, Arial';
        y += 36;
        const wrapped = wrapText(tc, f.value, CONTENT_W - 20);
        y += Math.max(wrapped.length, 1) * 38 + 24 + 20;
      });
      const imgs = uploadedImages.filter(Boolean);
      if (imgs.length) y += 220 + 50;
      y += 80;
      return y;
    }

    const totalH = measurePageHeight();
    const canvas = document.createElement('canvas');
    canvas.width = PW;
    canvas.height = Math.max(totalH, PH);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#D4A017';
    ctx.fillRect(0, 0, PW, 8);

    ctx.font = 'bold 64px Cairo, Arial';
    ctx.fillStyle = '#D4A017';
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.fillText('ملف تصميم الشعار', PW - MARGIN, 90);

    ctx.font = '28px Cairo, Arial';
    ctx.fillStyle = '#888888';
    ctx.textAlign = 'left';
    ctx.direction = 'ltr';
    ctx.fillText(new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }), MARGIN, 90);

    ctx.strokeStyle = '#D4A017';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(MARGIN, 110);
    ctx.lineTo(PW - MARGIN, 110);
    ctx.stroke();

    let y = 150;

    for (const field of fields) {
      ctx.font = 'bold 26px Cairo, Arial';
      ctx.fillStyle = '#D4A017';
      ctx.textAlign = 'right';
      ctx.direction = 'rtl';
      ctx.fillText(field.label, PW - MARGIN, y + 22);
      y += 36;

      ctx.font = '28px Cairo, Arial';
      const lines = wrapText(ctx, field.value, CONTENT_W - 40);
      const boxH = Math.max(lines.length, 1) * 38 + 24;

      ctx.fillStyle = '#1A1A1A';
      roundRect(ctx, MARGIN, y, CONTENT_W, boxH, 12);
      ctx.fill();

      ctx.fillStyle = '#D4A017';
      ctx.fillRect(PW - MARGIN - 4, y, 4, boxH);

      ctx.fillStyle = '#E8E8E8';
      ctx.textAlign = 'right';
      ctx.direction = 'rtl';
      lines.forEach((line, i) => {
        ctx.fillText(line, PW - MARGIN - 20, y + 34 + i * 38);
      });

      y += boxH + 20;
    }

    const imgs = uploadedImages.filter(Boolean);
    if (imgs.length > 0) {
      y += 20;
      ctx.font = 'bold 26px Cairo, Arial';
      ctx.fillStyle = '#D4A017';
      ctx.textAlign = 'right';
      ctx.direction = 'rtl';
      ctx.fillText('صور المراجع', PW - MARGIN, y + 22);
      y += 50;

      const imgSize = 180;
      const imgGap = 20;
      let ix = PW - MARGIN - imgSize;

      const loadImage = (src) => new Promise((res) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = () => res(null);
        img.src = src;
      });

      for (const src of imgs) {
        if (ix < MARGIN) break;
        const img = await loadImage(src);
        if (img) {
          ctx.strokeStyle = '#D4A017';
          ctx.lineWidth = 2;
          roundRect(ctx, ix, y, imgSize, imgSize, 10);
          ctx.stroke();
          ctx.save();
          roundRect(ctx, ix, y, imgSize, imgSize, 10);
          ctx.clip();
          ctx.drawImage(img, ix, y, imgSize, imgSize);
          ctx.restore();
        }
        ix -= imgSize + imgGap;
      }
      y += imgSize + 20;
    }

    const footerY = canvas.height - 50;
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, footerY - 10, PW, 60);
    ctx.fillStyle = '#D4A017';
    ctx.fillRect(0, footerY - 10, PW, 3);
    ctx.font = '22px Cairo, Arial';
    ctx.fillStyle = '#666666';
    ctx.textAlign = 'right';
    ctx.direction = 'rtl';
    ctx.fillText('ملف تصميم الشعار — Logo Brief', PW - MARGIN, footerY + 20);
    ctx.textAlign = 'left';
    ctx.direction = 'ltr';
    ctx.fillText(new Date().getFullYear().toString(), MARGIN, footerY + 20);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfW = 210;
    const pdfPageH = 295;
    const pdfImgH = (canvas.height * pdfW) / canvas.width;

    if (pdfImgH <= pdfPageH) {
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfImgH);
    } else {
      let remaining = pdfImgH;
      let offset = 0;
      while (remaining > 0) {
        pdf.addImage(imgData, 'PNG', 0, -offset, pdfW, pdfImgH);
        remaining -= pdfPageH;
        offset += pdfPageH;
        if (remaining > 0) pdf.addPage();
      }
    }

    const clientName = document.getElementById('clientName').value || 'client';
    pdf.save(`logo-brief-${clientName.replace(/\s+/g, '-')}.pdf`);
    showToast('تم تحميل PDF بنجاح!');

  } catch (err) {
    console.error(err);
    showToast('خطأ في توليد PDF. يرجى المحاولة مجدداً.');
  } finally {
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> إرسال / PDF`;
    btn.disabled = false;
  }
}

// ---- مساعد رسم المستطيلات المدورة ----
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ---- إشعار التوست ----
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ---- مسح حدود التحقق ----
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => { el.style.borderColor = ''; });
  });
});
