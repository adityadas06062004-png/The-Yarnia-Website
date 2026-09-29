// ============================================================
// THE YARNIYA — script.js
// Reads all product/brand data from data.js. No prices or copy
// are hard-coded here.
// ============================================================

// ── Currency ──────────────────────────────────────────────
const CURRENCIES = {
  INR: { symbol: '₹',    rate: 1,      dec: 0 },
  USD: { symbol: '$',    rate: 0.012,  dec: 2 },
  EUR: { symbol: '€',    rate: 0.011,  dec: 2 },
  GBP: { symbol: '£',    rate: 0.0095, dec: 2 },
  AED: { symbol: 'AED ', rate: 0.044,  dec: 2 },
  JPY: { symbol: '¥',    rate: 1.78,   dec: 0 },
};
let activeCurrency = "INR";

function fmt(inr) {
  if (inr == null) return null;
  const c = CURRENCIES[activeCurrency];
  return c.symbol + (inr * c.rate).toFixed(c.dec);
}

// ── Brand text ──────────────────────────────────────────────
document.getElementById('heroTagline').textContent = BRAND.tagline;
document.getElementById('year').textContent = new Date().getFullYear();

const orderChannelNote = document.getElementById('orderChannelNote');
if (BRAND.whatsapp) {
  orderChannelNote.textContent = "Order or ask a question on WhatsApp, or send the form below.";
} // else keep the Instagram-first copy already in the HTML

// ── Product grid ─────────────────────────────────────────────
const productGrid = document.getElementById('productGrid');

function renderProducts() {
  productGrid.innerHTML = '';
  PRODUCTS.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';
    const hasImages = p.images && p.images.length > 0;
    const cover = hasImages ? p.images[0] : null;

    const priceHtml = p.price != null
      ? `<div class="product-price">${fmt(p.price)}</div>`
      : `<div class="product-price tbc">Price to be confirmed</div>`;

    card.innerHTML = `
      <div class="product-media">
        ${cover ? `<img src="${cover}" alt="${p.name} — handmade by The Yarniya" loading="lazy">` : `<div class="no-photo">Photo coming soon</div>`}
        ${hasImages && p.images.length > 1 ? `<div class="product-count">1 / ${p.images.length}</div>` : ''}
      </div>
      ${hasImages && p.images.length > 1 ? `<div class="product-thumbs"></div>` : ''}
      <div class="product-body">
        <div class="product-cat">${p.category.replace(/-/g, ' ')}</div>
        <h3 class="product-name">${p.name}</h3>
        ${priceHtml}
      </div>`;

    if (hasImages && p.images.length > 1) {
      const mediaImg = card.querySelector('.product-media img');
      const counter = card.querySelector('.product-count');
      const thumbWrap = card.querySelector('.product-thumbs');
      p.images.forEach((src, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = i === 0 ? 'active' : '';
        b.setAttribute('aria-label', `${p.name} photo ${i + 1} of ${p.images.length}`);
        b.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
        b.addEventListener('click', () => {
          mediaImg.src = src;
          counter.textContent = `${i + 1} / ${p.images.length}`;
          thumbWrap.querySelectorAll('button').forEach(x => x.classList.remove('active'));
          b.classList.add('active');
        });
        thumbWrap.appendChild(b);
      });
    }

    productGrid.appendChild(card);
  });
}

function refreshProductPrices() {
  document.querySelectorAll('.product-card').forEach((card, i) => {
    const p = PRODUCTS[i];
    const priceEl = card.querySelector('.product-price');
    if (p.price != null) { priceEl.textContent = fmt(p.price); priceEl.classList.remove('tbc'); }
  });
}

// ── Bouquet builder ───────────────────────────────────────────
const counts = {};
BOUQUET_FLOWERS.forEach(f => counts[f.id] = 0);
let stems = [];
const HARD_LIMIT = 15;

const flowerList = document.getElementById('flowerList');
const previewChips = document.getElementById('previewChips');
const visualBouq = document.getElementById('visualBouquet');
const stemCountEl = document.getElementById('stemCount');
const totalPriceEl = document.getElementById('totalPrice');
const tbcNote = document.getElementById('tbcNote');
const requestBtn = document.getElementById('requestBtn');
const builderNote = document.getElementById('builderNote');

const notes = [];
if (!BOUQUET_WRAPS.length) notes.push('Wrapping options');
if (!BOUQUET_RIBBONS.length) notes.push('Ribbon options');
if (!BOUQUET_ADDONS.length) notes.push('Add-ons');
if (notes.length) {
  builderNote.textContent = `${notes.join(', ')} will be added here once confirmed — for now, tell us your preference in the message when you order.`;
}

function totalStems() { return stems.length; }

function flowerUnitPrice(flowerId) {
  const f = BOUQUET_FLOWERS.find(x => x.id === flowerId);
  if (!f) return null;
  if (f.tierPricing) return null; // priced by tier, handled separately
  return null; // no per-stem price confirmed for non-rose flowers
}

function bouquetPriceBreakdown() {
  let known = 0;
  let hasUnknown = false;
  BOUQUET_FLOWERS.forEach(f => {
    const qty = counts[f.id];
    if (!qty) return;
    if (f.tierPricing) {
      const tier = Math.min(qty, 4);
      known += f.tierPricing[tier] != null ? f.tierPricing[tier] : 0;
      if (qty > 4) hasUnknown = true; // beyond the confirmed 1–4 rose tiers
    } else {
      hasUnknown = true;
    }
  });
  return { known, hasUnknown };
}

function renderFlowers() {
  flowerList.innerHTML = '';
  BOUQUET_FLOWERS.forEach(f => {
    const row = document.createElement('div');
    row.className = 'flower-row';
    row.dataset.id = f.id;
    const thumb = f.image
      ? `<img class="flower-thumb" src="${f.image}" alt="${f.name}" loading="lazy">`
      : `<div class="flower-thumb-fallback" aria-hidden="true">🌸</div>`;
    const priceLabel = f.tierPricing
      ? `1 stem ${fmt(f.tierPricing[1])} · up to 4 tiered`
      : `Price to be confirmed`;
    row.innerHTML = `
      <div class="flower-info">
        ${thumb}
        <div>
          <div style="font-weight:700">${f.name}</div>
          <div class="flower-price ${f.tierPricing ? '' : 'tbc'}" data-fprice="${f.id}">${priceLabel}</div>
        </div>
      </div>
      <div class="controls">
        <button class="btn cminus secondary" style="padding:6px 10px" data-id="${f.id}" aria-label="Remove one ${f.name}">−</button>
        <div class="qty" data-qty="${f.id}" style="min-width:24px;text-align:center">0</div>
        <button class="btn cplus" style="padding:6px 10px" data-id="${f.id}" aria-label="Add one ${f.name}">+</button>
      </div>`;
    flowerList.appendChild(row);
  });

  flowerList.addEventListener('click', e => {
    const btn = e.target.closest('button[data-id]');
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.classList.contains('cplus')) {
      if (totalStems() < HARD_LIMIT) {
        counts[id]++;
        stems.push(id);
        updateAll();
      }
    } else if (counts[id] > 0) {
      counts[id]--;
      const idx = stems.lastIndexOf(id);
      if (idx > -1) stems.splice(idx, 1);
      updateAll();
    }
  });
}

// Fibonacci spiral for the SVG preview
const PHI = 2.39996323;
function fibPos(n) {
  return Array.from({ length: n }, (_, i) => ({
    x: 140 + 15 * Math.sqrt(i) * Math.cos(i * PHI),
    y: 126 + 15 * Math.sqrt(i) * Math.sin(i * PHI) * 0.82,
  }));
}
const FLOWER_COLOR = { rose: '#C46B7A', lily: '#F5F1E6', tulip: '#E7A6B0', sunflower: '#F3C43B', daisy: '#FFFFFF' };
function buildSVG() {
  const n = stems.length;
  const pos = fibPos(n);
  let s = `<svg viewBox="0 0 280 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:260px;display:block;margin:0 auto" role="img" aria-label="Bouquet preview, ${n} stems">
  <defs><filter id="bsh"><feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-opacity="0.18"/></filter>
  <style>@keyframes bloomIn{0%{opacity:0;transform:scale(.1) rotate(-30deg)}65%{opacity:1;transform:scale(1.15) rotate(5deg)}100%{opacity:1;transform:scale(1) rotate(0)}}.bfl{animation:bloomIn .45s cubic-bezier(.34,1.56,.64,1) both}</style></defs>`;
  if (n > 0) {
    s += `<g opacity=".35">`;
    pos.forEach(p => { s += `<line x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="140" y2="200" stroke="#7A9166" stroke-width="1.3"/>`; });
    s += `</g>`;
  }
  stems.forEach((id, i) => {
    const p = pos[i]; if (!p) return;
    const color = FLOWER_COLOR[id] || '#C9A6D9';
    s += `<g class="bfl" transform="translate(${p.x.toFixed(1)},${p.y.toFixed(1)})" filter="url(#bsh)" style="transform-origin:${p.x.toFixed(1)}px ${p.y.toFixed(1)}px">
      <circle r="16" fill="${color}" opacity=".95" stroke="#ffffffaa" stroke-width="1"/>
    </g>`;
  });
  if (n === 0) {
    s += `<text x="140" y="118" text-anchor="middle" font-size="12" fill="#9b83ad" font-family="Poppins,sans-serif">Add flowers to see your bouquet ✨</text>`;
    s += `<text x="140" y="150" text-anchor="middle" font-size="38">💐</text>`;
  }
  return s + `</svg>`;
}

function updateAll() {
  BOUQUET_FLOWERS.forEach(f => {
    const q = flowerList.querySelector(`[data-qty="${f.id}"]`);
    const p = flowerList.querySelector(`.cplus[data-id="${f.id}"]`);
    const m = flowerList.querySelector(`.cminus[data-id="${f.id}"]`);
    const r = flowerList.querySelector(`.flower-row[data-id="${f.id}"]`);
    if (q) q.textContent = counts[f.id];
    if (p) p.disabled = totalStems() >= HARD_LIMIT;
    if (m) m.disabled = counts[f.id] === 0;
    if (r) r.classList.toggle('active', counts[f.id] > 0);
  });

  previewChips.innerHTML = '';
  BOUQUET_FLOWERS.forEach(f => {
    if (!counts[f.id]) return;
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.innerHTML = `${f.name} ×${counts[f.id]} <span style="opacity:.55">✕</span>`;
    chip.addEventListener('click', () => {
      if (counts[f.id] > 0) {
        counts[f.id]--;
        const idx = stems.lastIndexOf(f.id);
        if (idx > -1) stems.splice(idx, 1);
        updateAll();
      }
    });
    previewChips.appendChild(chip);
  });

  stemCountEl.textContent = totalStems() + (totalStems() === 1 ? ' stem' : ' stems');
  const { known, hasUnknown } = bouquetPriceBreakdown();
  totalPriceEl.textContent = (hasUnknown ? '≈ ' : '') + fmt(known);
  tbcNote.style.display = hasUnknown ? 'block' : 'none';
  visualBouq.innerHTML = buildSVG();
  requestBtn.disabled = totalStems() === 0;
}

// ── Currency selector ───────────────────────────────────────
function initCurrency() {
  const sel = document.getElementById('currencySelect');
  if (!sel) return;
  sel.value = activeCurrency;
  sel.addEventListener('change', () => {
    activeCurrency = sel.value;
    renderFlowers();
    updateAll();
    refreshProductPrices();
  });
}

// ── Order button (WhatsApp if configured, else Instagram) ────
requestBtn.addEventListener('click', () => {
  if (totalStems() === 0) { showToast('Add a flower to your bouquet first 🌸'); return; }
  const lines = BOUQUET_FLOWERS.filter(f => counts[f.id] > 0).map(f => `${f.name} ×${counts[f.id]}`).join('\n');
  const { known, hasUnknown } = bouquetPriceBreakdown();
  const msg = [
    `Hello ${BRAND.name}! I'd like to order a custom bouquet 🧶`,
    '',
    lines,
    '',
    `Estimated total: ${hasUnknown ? '≈ ' : ''}${fmt(known)}${hasUnknown ? ' (some flowers still need a confirmed price)' : ''}`,
    '',
    'Name:',
    'Delivery address:',
  ].join('\n');

  if (BRAND.whatsapp) {
    window.open(`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  } else {
    // No WhatsApp number configured yet — copy the summary and send them to Instagram.
    navigator.clipboard?.writeText(msg).catch(() => {});
    showToast('Bouquet summary copied — send it to us on Instagram!');
    window.open(BRAND.instagram, '_blank', 'noopener');
  }
});

// ── Contact form: Formspree + graceful fallback ──────────────
document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const submitBtn = document.getElementById('submitBtn');
  const name = String(form.name.value || '').replace(/<[^>]*>/g, '').trim();
  const email = String(form.email.value || '').replace(/<[^>]*>/g, '').trim();
  const rf = document.getElementById('replyToField');
  if (rf) rf.value = email;

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  try {
    const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
    if (res.ok) {
      submitBtn.textContent = '✅ Sent!';
      showToast(`Thanks ${name || 'friend'}! We'll get back to you soon 🧶`);
      form.reset();
      setTimeout(() => { submitBtn.textContent = '📧 Send Message'; submitBtn.disabled = false; }, 3000);
    } else { throw new Error('failed'); }
  } catch {
    submitBtn.textContent = '📧 Send Message';
    submitBtn.disabled = false;
    showToast("Couldn't send that — please message us on Instagram instead.");
  }
});

// ── Toast ─────────────────────────────────────────────────
function showToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.setAttribute('role', 'status');
  t.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#2a2230;color:#fff;padding:14px 22px;border-radius:12px;font-size:14px;font-weight:600;z-index:999;box-shadow:0 8px 28px rgba(0,0,0,.28);max-width:90vw;text-align:center;transition:opacity .4s;`;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 4000);
}

// ── Theme ─────────────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const mediaDark = window.matchMedia('(prefers-color-scheme: dark)');
function setDataTheme(v) {
  document.documentElement.setAttribute('data-theme', v);
  document.querySelectorAll('.logo-img').forEach(img => { img.src = v === 'dark' ? img.dataset.darkSrc : img.dataset.lightSrc; });
}
function applyTheme(t) {
  localStorage.setItem('yarniya-theme', t);
  setDataTheme(t === 'system' ? (mediaDark.matches ? 'dark' : 'light') : t);
  themeToggle.querySelectorAll('button').forEach(b => b.style.opacity = (localStorage.getItem('yarniya-theme') === b.dataset.theme) ? '1' : '0.55');
}
mediaDark.addEventListener('change', () => {
  if ((localStorage.getItem('yarniya-theme') || 'system') === 'system') setDataTheme(mediaDark.matches ? 'dark' : 'light');
});
(() => {
  const saved = localStorage.getItem('yarniya-theme') || 'system';
  setDataTheme(saved === 'system' ? (mediaDark.matches ? 'dark' : 'light') : saved);
  themeToggle.querySelectorAll('button').forEach(b => b.style.opacity = (saved === b.dataset.theme) ? '1' : '0.55');
})();
themeToggle.querySelectorAll('button').forEach(b => b.addEventListener('click', () => applyTheme(b.dataset.theme)));

// ── Init ──────────────────────────────────────────────────
renderProducts();
renderFlowers();
initCurrency();
updateAll();

const io = new IntersectionObserver(entries =>
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
  { threshold: 0.1 }
);
document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(a =>
  a.addEventListener('click', ev => {
    const t = a.getAttribute('href');
    if (t.length > 1) { ev.preventDefault(); document.querySelector(t)?.scrollIntoView({ behavior: 'smooth' }); }
  })
);
