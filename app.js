/* ------------------------------------------------------------------
   CAR LIST  →  cars.txt  (next to index.html)
   One car per line, in the order they appear on the site:

     Model-Year-Place        e.g.  Bianchina-1962-Rimini

   The whole line is also the photo folder name (case-sensitive!):

     assets/<line>/<line>-<NN>-<WIDTH>.webp
     assets/Bianchina-1962-Rimini/Bianchina-1962-Rimini-01-0600.webp

   NN    = photo number, two digits (01 = cover)
   WIDTH = 0300, 0600, 1200 (required) and 1920 (optional, per photo)

   The site finds the photos by itself: it tries 01, 02, 03 ... until a
   file is missing. Empty lines and lines starting with # are ignored.

   Each car folder also holds its data file  <line>-00-Card.txt  :

     assets/Bianchina-1962-Rimini/Bianchina-1962-Rimini-00-Card.txt

   with "key: value" lines (title, imageAlt, series, year, mileage,
   displacement, power, transmission, price, description, history).
   description / history may continue over several lines; a blank line
   starts a new paragraph. A value of n/a (or empty) is simply not shown.
   ------------------------------------------------------------------ */
const CARS_FILE = 'cars.txt';

/* FALLBACKS, keyed by the Model part of the line. Used only for what the
   car's Card.txt does not provide (or when it is missing). "category"
   (coupe | spider | saloon) drives the home page filters; it can also be
   given in Card.txt as a "category:" line. */
const CAR_INFO = {
  "GTScalino":  {name:"Alfa Romeo Giulia GT Scalino", category:"coupe"},
  "Testarossa": {name:"Ferrari Testarossa",           category:"coupe"},
  "850Spider":  {name:"Fiat 850 Spider",              category:"spider"},
  "500L":       {name:"Fiat 500 L",                   category:"saloon"},
  "Bianchina":  {name:"Autobianchi Bianchina Cabriolet", category:"spider"},
  "FulviaHF":   {name:"Lancia Fulvia HF",             category:"coupe"}
};
const CATEGORY_LABEL = {coupe:'COUPÉ', spider:'SPIDER', saloon:'BERLINA'};
const SPEC_ROWS = [['year','Год выпуска'],['location','Местонахождение'],['series','Серия'],['mileage','Пробег'],['engine','Двигатель'],['power','Мощность'],['gearbox','Коробка передач'],['fuel','Топливо'],['drive','Привод'],['condition','Состояние']];

let cars = [];

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function parseCars(text){
  return text.replace(/^\uFEFF/, '').split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(line => {
    const [model, year = '', ...rest] = line.split('-');
    const info = CAR_INFO[model] || {};
    const place = rest.join(' ').replace(/_/g, ' ');
    return {
      id: line.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      folder: line, model, year, location: place,
      name: info.name || model.replace(/([a-z])([A-Z0-9])/g, '$1 $2'),
      category: info.category || '', photos: 0, hd: [], probed: false,
      ...info
    };
  });
}

/* ---------- per-car data file: <folder>/<folder>-00-Card.txt ---------- */
const isEmpty = v => !v || /^(n\/a|-|—|none)$/i.test(v.trim());

function parseCard(text){
  const lines = {}; let key = null;
  for (const raw of text.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    const m = raw.match(/^([a-z][A-Za-z0-9]*):\s?(.*)$/);
    if (m) { key = m[1]; lines[key] = [m[2]]; }
    else if (key) lines[key].push(raw);
  }
  const out = {};
  for (const [k, arr] of Object.entries(lines)) {
    // blank line = new paragraph; other line breaks are joined with a space
    const v = arr.join('\n').split(/\n\s*\n/).map(p => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean).join('\n\n');
    if (!isEmpty(v)) out[k] = v;
  }
  return out;
}

async function loadCard(car){
  try {
    const url = encodeURI(`assets/${car.folder}/${car.folder}-00-Card.txt`);
    const res = await fetch(url, {cache:'no-cache'});
    if (!res.ok) return;
    const text = await res.text();
    if (/^\s*</.test(text)) return;          // host returned an HTML page instead of the file
    const c = parseCard(text);
    if (c.title)        car.name = c.title;
    if (c.imageAlt)     car.alt = c.imageAlt;
    if (c.year)         car.year = c.year;
    if (c.series)       car.series = c.series;
    if (c.mileage)      car.mileage = c.mileage;
    if (c.displacement) car.engine = c.displacement;
    if (c.power)        car.power = c.power;
    if (c.transmission) car.gearbox = c.transmission;
    if (c.price)        car.price = c.price;
    if (c.description)  car.story = c.description;
    if (c.history)      car.history = c.history;
    if (c.category)     car.category = c.category.toLowerCase();
  } catch (err) { console.warn('Card file not loaded for', car.folder, err); }
}

async function loadCars(){
  const res = await fetch(CARS_FILE, {cache:'no-cache'});
  if (!res.ok) throw new Error(`${CARS_FILE}: HTTP ${res.status}`);
  cars = parseCars(await res.text());
  await Promise.all(cars.map(loadCard));
}

/* ---------- image helpers ---------- */
const pad = (n, len) => String(n).padStart(len, '0');
const photoCount = car => car.photos || 1;
const photoUrl = (car, n, w) => encodeURI(`assets/${car.folder}/${car.folder}-${pad(n, 2)}-${pad(w, 4)}.webp`);
// 300 / 600 / 1200 always; 1920 only for photos found in car.hd
const photoWidths = (car, n, max = 1920) =>
  [300, 600, 1200, ...(car.hd.includes(n) ? [1920] : [])].filter(w => w <= max);
const photoSrcset = (car, n, max) => photoWidths(car, n, max).map(w => `${photoUrl(car, n, w)} ${w}w`).join(', ');

const SIZES_CARD  = '(max-width:650px) 88vw, (max-width:900px) 45vw, 28vw';
const SIZES_MAIN  = '(max-width:650px) 88vw, (max-width:900px) 52vw, 54vw';
const SIZES_THUMB = '(max-width:650px) 22vw, 13vw';

// Shown automatically if a photo file is missing, so the layout never breaks
const PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'><rect width='1200' height='800' fill='#ddd5c7'/>" +
  "<text x='600' y='410' text-anchor='middle' font-family='Georgia,serif' font-style='italic' font-size='44' fill='#77776e'>Foto in arrivo</text></svg>");

document.addEventListener('error', e => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement) || img.dataset.fallback === '1') return;
  img.dataset.fallback = '1';
  img.removeAttribute('srcset');
  img.src = PLACEHOLDER;
}, true);

// Finds how many numbered photos a car has. Probes the small 300px files in
// parallel batches (fast), stopping at the first batch that contains a gap.
// 1920px versions are checked lazily, only for the photo actually displayed.
const imageExists = url => new Promise(r => { const i = new Image(); i.onload = () => r(true); i.onerror = () => r(false); i.src = url; });
async function discoverPhotos(car){
  if (car.probed) return;
  const BATCH = 8, MAX = 80;
  let count = 0, done = false;
  for (let start = 1; start <= MAX && !done; start += BATCH) {
    const nums = Array.from({length: BATCH}, (_, i) => start + i);
    const res = await Promise.all(nums.map(n => imageExists(photoUrl(car, n, 300))));
    for (const ok of res) { if (!ok) { done = true; break; } count++; }
  }
  car.photos = count; car.probed = true;
}
/* How many physical pixels wide the main photo is on this screen. */
const neededWidth = () => {
  const el = document.getElementById('gallery-main-image');
  return (el ? el.clientWidth : 0) * (window.devicePixelRatio || 1);
};
/* The 1920px file is a bonus: it is only looked for when this screen could
   show more detail than the 1200px one (large / retina display). Otherwise
   it is never requested. Photos without a 1920 version simply stay at 1200. */
const hdChecked = new Set();
async function ensureHd(car, n){
  if (neededWidth() <= 1200) return false;
  const key = car.id + ':' + n;
  if (!hdChecked.has(key)) {
    hdChecked.add(key);
    if (await imageExists(photoUrl(car, n, 1920)) && !car.hd.includes(n)) car.hd.push(n);
  }
  return car.hd.includes(n);
}
// Smallest file that is sharp enough for this screen (used for preloading)
function widthForScreen(car, n){
  const need = neededWidth();
  return [300, 600, 1200].find(w => w >= need) || (car.hd.includes(n) ? 1920 : 1200);
}

/* ---------- rendering ---------- */
const app = document.getElementById('app');
const grid = document.getElementById('car-grid');
const HOME_SECTIONS = ['.hero', '.intro-strip', '.collection', '.method', '.manifesto', '.contact-band'];
const activeFilter = () => document.querySelector('.filter.active')?.dataset.filter || 'all';

function cardMeta(car){
  const parts = [car.mileage, car.power, car.gearbox && car.gearbox.split(',')[0]].filter(Boolean);
  return parts.length ? `<div class="car-meta">${parts.map(p => `<span>${esc(p)}</span>`).join('')}</div>` : '';
}

function cardMarkup(car){
  const tag = CATEGORY_LABEL[car.category];
  return `<article class="car-card" data-category="${esc(car.category)}" data-id="${esc(car.id)}" tabindex="0" role="link" aria-label="Открыть ${esc(car.alt || car.name)}">
  <div class="car-image-wrap"><img class="car-image" src="${photoUrl(car,1,600)}" srcset="${photoSrcset(car,1,1200)}" sizes="${SIZES_CARD}" alt="${esc(car.alt || car.name)}" loading="lazy" decoding="async">${tag ? `<span class="car-tag">${tag}</span>` : ''}</div>
  <div class="car-card-top"><span class="car-year">${esc(car.year)} · ${esc(car.location.toUpperCase())}</span>${car.price ? `<span class="car-price">${esc(car.price)}</span>` : ''}</div>
  <h3>${esc(car.name.replace(/:\s*/, ': '))}</h3>${cardMeta(car)}
  <span class="card-arrow">СМОТРЕТЬ АВТОМОБИЛЬ <span>↗</span></span></article>`;
}

function renderGrid(filter = activeFilter()){
  grid.innerHTML = cars.filter(c => filter === 'all' || c.category === filter).map(cardMarkup).join('');
  const all = document.querySelector('.filter[data-filter="all"] span');
  if (all) all.textContent = pad(cars.length, 2);
}

function thumbsMarkup(car){
  if (photoCount(car) < 2) return '';
  let html = '';
  for (let n = 1; n <= photoCount(car); n++) {
    html += `<button class="gallery-thumb ${n===1?'active':''}" data-n="${n}" aria-label="Фото ${n}"><img src="${photoUrl(car,n,300)}" srcset="${photoSrcset(car,n,600)}" sizes="${SIZES_THUMB}" alt="" loading="lazy" decoding="async" draggable="false"></button>`;
  }
  return `<div class="gallery-thumbs" role="list" aria-label="Все фотографии">${html}</div>`;
}

function titleMarkup(name){
  // "Headline: 1962 Car name" → second part in italics; otherwise the first word stays plain
  const c = name.indexOf(':');
  if (c > 0) return `${esc(name.slice(0, c))}: <em>${esc(name.slice(c + 1).trim())}</em>`;
  const i = name.indexOf(' ');
  return i < 0 ? `<em>${esc(name)}</em>` : `${esc(name.slice(0, i))} <em>${esc(name.slice(i + 1))}</em>`;
}

const paragraphs = t => String(t).split(/\n\n/).map(p => `<p>${esc(p)}</p>`).join('');

function detailMarkup(car){
  const rows = SPEC_ROWS.filter(([k]) => car[k]).map(([k, label]) => `<div class="spec-row"><dt>${label}</dt><dd>${esc(car[k])}</dd></div>`).join('');
  return `<section class="detail-shell" data-car="${esc(car.id)}">
  <a class="back-link" href="#/"><span>←</span> НАЗАД К НАХОДКАМ</a>
  <div class="detail-title-row"><div><p class="eyebrow">TROVATA IN ITALIA · ${esc(car.year)}</p><h1>${titleMarkup(car.name)}</h1></div><div class="detail-price">${esc(car.price || 'Цена по запросу')}</div></div>
  <div class="detail-layout"><div><div class="gallery-main"><img id="gallery-main-image" draggable="false" src="${photoUrl(car,1,1200)}" srcset="${photoSrcset(car,1)}" sizes="${SIZES_MAIN}" alt="${esc(car.alt || car.name)} — фотография"><button class="gallery-nav prev" aria-label="Предыдущее фото" hidden>‹</button><button class="gallery-nav next" aria-label="Следующее фото" hidden>›</button><span class="gallery-count" hidden></span></div><div class="gallery-thumbs-slot"></div></div>
  <aside class="spec-card"><p class="eyebrow">SCHEDA TECNICA</p><h2>Характеристики</h2><dl class="spec-list">${rows}</dl>
  <p class="spec-note">Финальные условия, документы, осмотр и логистика обсуждаются индивидуально.</p><a class="button button-dark" href="mailto:ciao@italianfinds.example?subject=${encodeURIComponent('Запрос: '+(car.alt || car.name))}">Запросить информацию <span>↗</span></a></aside></div>
  <div class="detail-story"><p class="eyebrow">LA STORIA</p><h2>У этой находки есть характер.</h2>${paragraphs(car.story || 'Подробное описание, история владения, документы и результаты осмотра — по запросу.')}${car.history ? paragraphs(car.history) : ''}</div>
  </section>`;
}

function setHomeVisible(visible){
  HOME_SECTIONS.forEach(sel => { const el = document.querySelector(sel); if (el) el.style.display = visible ? '' : 'none'; });
}

async function renderRoute(){
  const id = location.hash.match(/^#\/car\/(.+)$/)?.[1];
  const old = document.querySelector('.detail-shell');
  if (old) old.remove();
  if (!id) { setHomeVisible(true); renderGrid(); window.scrollTo(0,0); return; }
  const car = cars.find(c => c.id === id);
  if (!car) { location.hash = '#/'; return; }
  setHomeVisible(false);
  app.insertAdjacentHTML('afterbegin', detailMarkup(car));
  window.scrollTo(0,0);
  // photos are discovered after the page is shown, then thumbnails / HD are filled in
  await discoverPhotos(car);
  const shell = document.querySelector('.detail-shell');
  if (!shell || shell.dataset.car !== car.id) return;   // user navigated away meanwhile
  shell.querySelector('.gallery-thumbs-slot').innerHTML = thumbsMarkup(car);
  shell.querySelectorAll('.gallery-nav, .gallery-count').forEach(el => el.hidden = photoCount(car) < 2);
  showPhoto(car, 1);
}

let currentPhoto = 1;
function currentCar(){
  const id = document.querySelector('.detail-shell')?.dataset.car;
  return cars.find(c => c.id === id);
}

async function showPhoto(car, n){
  const total = photoCount(car);
  n = ((n - 1 + total) % total) + 1;          // wrap around
  currentPhoto = n;
  const main = document.getElementById('gallery-main-image');
  delete main.dataset.fallback;               // allow the placeholder logic to run again
  main.sizes = SIZES_MAIN;
  main.srcset = photoSrcset(car, n);          // 300/600/1200 (+1920 if already known)
  main.src = photoUrl(car, n, 1200);
  const count = document.querySelector('.gallery-count');
  if (count) count.textContent = `${n} / ${total}`;
  // highlight the thumbnail and bring it into view inside the strip (without scrolling the page)
  const strip = document.querySelector('.gallery-thumbs');
  if (strip) {
    strip.querySelectorAll('.gallery-thumb').forEach(b => b.classList.toggle('active', Number(b.dataset.n) === n));
    const t = strip.querySelector(`.gallery-thumb[data-n="${n}"]`);
    if (t) strip.scrollTo({left: t.offsetLeft - (strip.clientWidth - t.offsetWidth) / 2, behavior: 'smooth'});
  }
  // preload the neighbours at the size this screen actually needs
  [n + 1, n - 1].forEach(m => { if (m >= 1 && m <= total) new Image().src = photoUrl(car, m, widthForScreen(car, m)); });
  // 1920px only on screens that can benefit, and only if that file exists
  if (await ensureHd(car, n) && currentPhoto === n && main.dataset.fallback !== '1') main.srcset = photoSrcset(car, n);
}
const stepPhoto = d => { const car = currentCar(); if (car && photoCount(car) > 1) showPhoto(car, currentPhoto + d); };

// swipe on the main photo
let swipeX = null, swipeY = null;
document.addEventListener('touchstart', e => {
  if (!e.target.closest('.gallery-main')) return;
  swipeX = e.touches[0].clientX; swipeY = e.touches[0].clientY;
}, {passive: true});
document.addEventListener('touchend', e => {
  if (swipeX === null) return;
  const dx = e.changedTouches[0].clientX - swipeX, dy = e.changedTouches[0].clientY - swipeY;
  swipeX = swipeY = null;
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) stepPhoto(dx < 0 ? 1 : -1);
}, {passive: true});

document.addEventListener('click', e => {
  const card = e.target.closest('.car-card');
  if (card) { location.hash = `#/car/${card.dataset.id}`; return; }
  const filter = e.target.closest('.filter');
  if (filter) {
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    filter.classList.add('active');
    renderGrid(filter.dataset.filter);
    return;
  }
  const thumb = e.target.closest('.gallery-thumb');
  if (thumb) { showPhoto(currentCar(), Number(thumb.dataset.n)); return; }
  const nav = e.target.closest('.gallery-nav');
  if (nav) stepPhoto(nav.classList.contains('next') ? 1 : -1);
});
document.addEventListener('keydown', e => {
  if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && document.querySelector('.detail-shell')) { stepPhoto(e.key === 'ArrowRight' ? 1 : -1); return; }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.car-card')) { e.preventDefault(); location.hash = `#/car/${e.target.dataset.id}`; }
});
window.addEventListener('hashchange', renderRoute);
document.querySelector('.menu-toggle').addEventListener('click', () => {
  const nav = document.querySelector('.main-nav');
  const open = nav.style.display === 'flex';
  nav.style.display = open ? 'none' : 'flex';
  nav.style.position = open ? '' : 'absolute';
  nav.style.top = '72px'; nav.style.left = '0'; nav.style.right = '0';
  nav.style.padding = '22px 7%'; nav.style.background = 'var(--paper)'; nav.style.flexDirection = 'column';
});

loadCars().then(renderRoute).catch(err => {
  console.error(err);
  grid.innerHTML = `<p class="load-error">Не удалось загрузить список автомобилей (${esc(CARS_FILE)}). Откройте сайт через веб-сервер (например, <code>python3 -m http.server</code>), а не как файл.</p>`;
});

/* ---------- home image look: assets/Home/Home-Settings.txt ----------
   brightness / saturation / contrast in percent for the hero and manifesto
   images (100 = unchanged). Missing file or line = built-in defaults. */
(async function loadHomeSettings(){
  try {
    const res = await fetch('assets/Home/Home-Settings.txt', {cache:'no-cache'});
    if (!res.ok) return;
    const root = document.documentElement.style;
    for (const raw of (await res.text()).replace(/^\uFEFF/, '').split(/\r?\n/)) {
      const m = raw.match(/^\s*(hero|manifesto)-(brightness|saturation|contrast)\s*:\s*([\d.]+)/i);
      if (m) root.setProperty(`--${m[1].toLowerCase()}-${m[2].toLowerCase()}`, String(parseFloat(m[3]) / 100));
    }
  } catch (e) { /* keep defaults */ }
})();
