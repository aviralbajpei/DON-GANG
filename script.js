/* ===== SMART AI SUSTAINABLE MIRROR — script.js ===== */

// ─── NAV SCROLL EFFECT ───────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ─── HAMBURGER MENU ──────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
  navbar.classList.toggle('menu-open');
});

// Close menu on nav link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navbar.classList.remove('menu-open'));
});

// ─── REVEAL ON SCROLL ─────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings in the same parent
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      siblings.forEach((el, idx) => {
        setTimeout(() => el.classList.add('visible'), idx * 80);
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// ─── ANIMATED COUNTERS ────────────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const update = () => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + suffix;
    if (current < target) requestAnimationFrame(update);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(update);
}

const counters = document.querySelectorAll('.counter-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// ─── DEMO SIMULATION ─────────────────────────────────────────────
const runDemoBtn = document.getElementById('runDemo');
const scanOverlay = document.getElementById('scanOverlay');
const scanLine = document.getElementById('scanLine');
const scanStatus = document.getElementById('scanStatus');
const resultPanel = document.getElementById('resultPanel');
const resultItems = document.getElementById('resultItems');
const resultStatus = document.getElementById('resultStatus');
const resultTagsEl = document.getElementById('resultTags');
const susPanel = document.getElementById('susPanel');
const susFill = document.getElementById('susFill');
const susNum = document.getElementById('susNum');
const co2Num = document.getElementById('co2Num');
const ecoAlts = document.getElementById('ecoAlts');

const scanStatuses = [
  'INITIALIZING AI ENGINE...',
  'CALIBRATING CAMERA...',
  'DETECTING FEATURES...',
  'ANALYZING SKIN TONE...',
  'MAPPING BODY TYPE...',
  'CROSS-REFERENCING INVENTORY...',
  'CALCULATING ECO SCORE...',
  'ANALYSIS COMPLETE ✓'
];

const resultData = [
  { label: 'Skin Tone', value: 'Wheatish (Warm Undertone)' },
  { label: 'Body Type', value: 'Hourglass' },
  { label: 'Rec. Colors', value: 'Navy Blue, Emerald Green' },
  { label: 'Rec. Styles', value: 'A-line Dress, Slim Fit' },
  { label: 'Best Cuts', value: 'Wrap, Fitted Waist, Flared' },
];

const tags = ['A-line Dress', 'Slim Fit Jeans', 'Emerald Wrap', 'Navy Blazer', 'Fitted Turtleneck'];

let isRunning = false;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function animateScan() {
  // Start scan overlay
  scanOverlay.classList.add('active');
  const frameH = scanLine.parentElement.offsetHeight;
  let pos = 0;
  const scanInterval = setInterval(() => {
    pos = (pos + 2) % frameH;
    scanLine.style.top = pos + 'px';
  }, 16);

  // Cycle through statuses
  for (let i = 0; i < scanStatuses.length; i++) {
    scanStatus.textContent = scanStatuses[i];
    await sleep(i === scanStatuses.length - 1 ? 600 : 500);
  }

  clearInterval(scanInterval);
  scanLine.style.top = '0px';
  await sleep(300);
  scanOverlay.classList.remove('active');
}

function renderResultItems() {
  resultItems.innerHTML = '';
  resultData.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'result-item';
    div.style.opacity = '0';
    div.style.transform = 'translateX(-12px)';
    div.innerHTML = `<span class="ri-label">${item.label}</span><span class="ri-value">${item.value}</span>`;
    resultItems.appendChild(div);
    setTimeout(() => {
      div.style.transition = 'all 0.4s ease';
      div.style.opacity = '1';
      div.style.transform = 'translateX(0)';
    }, i * 120 + 100);
  });
}

function renderTags() {
  resultTagsEl.innerHTML = '';
  tags.forEach((tag, i) => {
    const span = document.createElement('span');
    span.className = 'result-tag';
    span.textContent = tag;
    resultTagsEl.appendChild(span);
    setTimeout(() => span.classList.add('show'), i * 100 + 200);
  });
}

async function renderSustainability() {
  susPanel.classList.remove('hidden');
  susPanel.style.opacity = '0';
  await sleep(100);
  susPanel.style.transition = 'opacity 0.5s ease';
  susPanel.style.opacity = '1';

  // Animate score bar (8.5/10)
  await sleep(300);
  susFill.style.width = '85%';
  susNum.textContent = '8.5/10';
  co2Num.textContent = '4.2 kg CO₂';

  await sleep(800);
  ecoAlts.classList.remove('hidden');
}

runDemoBtn.addEventListener('click', async () => {
  if (isRunning) return;
  isRunning = true;
  runDemoBtn.disabled = true;
  runDemoBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Scanning...';

  // Reset
  resultItems.innerHTML = '<div class="result-item"><span class="ri-label">Status</span><span class="ri-value muted">Scanning...</span></div>';
  resultTagsEl.innerHTML = '';
  susPanel.classList.add('hidden');
  susPanel.style.opacity = '0';
  ecoAlts.classList.add('hidden');
  susFill.style.width = '0%';
  susNum.textContent = '0/10';
  co2Num.textContent = '–';
  resultStatus.textContent = 'Scanning...';

  await animateScan();

  resultStatus.textContent = 'Complete ✓';
  renderResultItems();

  await sleep(500);
  renderTags();

  await sleep(800);
  await renderSustainability();

  runDemoBtn.disabled = false;
  runDemoBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Scan Again';
  isRunning = false;
});

// ─── SMOOTH ACTIVE NAV HIGHLIGHTING ──────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navLinks.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + current) {
      a.style.color = 'var(--green)';
    }
  });
});

// ─── STEP ITEMS STAGGER ON SCROLL ────────────────────────────────
const stepItems = document.querySelectorAll('.step-item');
const stepObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = parseInt(entry.target.dataset.step) - 1;
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, idx * 150);
      stepObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

stepItems.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  stepObserver.observe(el);
});

// ─── FEATURE CARD TILT EFFECT ────────────────────────────────────
document.querySelectorAll('.feature-card, .about-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease, border-color 0.35s, box-shadow 0.35s';
  });
});
