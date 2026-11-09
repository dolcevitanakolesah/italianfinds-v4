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
   ------------------------------------------------------------------ */
const CARS_FILE = 'cars.txt';

/* OPTIONAL extra info, keyed by the Model part of the line.
   Without an entry the model name is just prettified ("FulviaHF" → "Fulvia HF").
   Any of these keys may be added: name, category (coupe | spider | saloon),
   price, mileage, engine, power, gearbox, fuel, drive, condition, story. */
const CAR_INFO = {
  "GTScalino":  {name:"Alfa Romeo Giulia GT Scalino", category:"coupe"},
  "Testarossa": {name:"Ferrari Testarossa",           category:"coupe"},
  "850Spider":  {name:"Fiat 850 Spider",              category:"spider"},
  "500L":       {name:"Fiat 500 L",                   category:"saloon"},
  "Bianchina":  {name:"Autobianchi Bianchina Cabriolet", category:"spider"},
  "FulviaHF":   {name:"Lancia Fulvia HF",             category:"coupe"}
};
const CATEGORY_LABEL = {coupe:'COUPÉ', spider:'SPIDER', saloon:'BERLINA'};
const SPEC_ROWS = [['year','Год выпуска'],['location','Местонахождение'],['mileage','Пробег'],['engine','Двигатель'],['power','Мощность'],['gearbox','Коробка передач'],['fuel','Топливо'],['drive','Привод'],['condition','Состояние']];

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

async function loadCars(){
  const res = await fetch(CARS_FILE, {cache:'no-cache'});
  if (!res.ok) throw new Error(`${CARS_FILE}: HTTP ${res.status}`);
  cars = parseCars(await res.text());
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

// Finds how many numbered photos a car has (and which have a 1920 version)
const imageExists = url => new Promise(r => { const i = new Image(); i.onload = () => r(true); i.onerror = () => r(false); i.src = url; });
async function discoverPhotos(car){
  if (car.probed) return;
  let n = 1; const hd = [];
  while (n <= 60) {
    const [ok, hdOk] = await Promise.all([imageExists(photoUrl(car, n, 300)), imageExists(photoUrl(car, n, 1920))]);
    if (!ok) break;
    if (hdOk) hd.push(n);
    n++;
  }
  car.photos = n - 1; car.hd = hd; car.probed = true;
}

/* ---------- rendering ---------- */
const app = document.getElementById('app');
const grid = document.getElementById('car-grid');
const HOME_SECTIONS = ['.hero', '.intro-strip', '.collection', '.manifesto', '.contact-band', '.method'];
const activeFilter = () => document.querySelector('.filter.active')?.dataset.filter || 'all';

function cardMarkup(car){
  const tag = CATEGORY_LABEL[car.category];
  return `<article class="car-card" data-category="${esc(car.category)}" data-id="${esc(car.id)}" tabindex="0" role="link" aria-label="Открыть ${esc(car.name)}">
  <div class="car-image-wrap"><img class="car-image" src="${photoUrl(car,1,600)}" srcset="${photoSrcset(car,1,1200)}" sizes="${SIZES_CARD}" alt="${esc(car.name)}" loading="lazy" decoding="async">${tag ? `<span class="car-tag">${tag}</span>` : ''}</div>
  <div class="car-card-top"><span class="car-year">${esc(car.year)} · ${esc(car.location.toUpperCase())}</span>${car.price ? `<span class="car-price">${esc(car.price)}</span>` : ''}</div>
  <h3>${esc(car.name)}</h3>
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
    html += `<button class="gallery-thumb ${n===1?'active':''}" data-n="${n}" aria-label="Фото ${n}"><img src="${photoUrl(car,n,300)}" srcset="${photoSrcset(car,n,600)}" sizes="${SIZES_THUMB}" alt="" loading="lazy" decoding="async"></button>`;
  }
  return `<div class="gallery-thumbs">${html}</div>`;
}

function titleMarkup(name){
  const i = name.indexOf(' ');
  return i < 0 ? `<em>${esc(name)}</em>` : `${esc(name.slice(0, i))} <em>${esc(name.slice(i + 1))}</em>`;
}

function detailMarkup(car){
  const rows = SPEC_ROWS.filter(([k]) => car[k]).map(([k, label]) => `<div class="spec-row"><dt>${label}</dt><dd>${esc(car[k])}</dd></div>`).join('');
  return `<section class="detail-shell" data-car="${esc(car.id)}">
  <a class="back-link" href="#/"><span>←</span> НАЗАД К НАХОДКАМ</a>
  <div class="detail-title-row"><div><p class="eyebrow">TROVATA IN ITALIA · ${esc(car.year)}</p><h1>${titleMarkup(car.name)}</h1></div><div class="detail-price">${esc(car.price || 'Цена по запросу')}</div></div>
  <div class="detail-layout"><div><div class="gallery-main"><img id="gallery-main-image" src="${photoUrl(car,1,1200)}" srcset="${photoSrcset(car,1)}" sizes="${SIZES_MAIN}" alt="${esc(car.name)} — фотография"></div><div class="gallery-thumbs-slot"></div></div>
  <aside class="spec-card"><p class="eyebrow">SCHEDA TECNICA</p><h2>Характеристики</h2><dl class="spec-list">${rows}</dl>
  <p class="spec-note">Финальные условия, документы, осмотр и логистика обсуждаются индивидуально.</p><a class="button button-dark" href="mailto:ciao@italianfinds.example?subject=${encodeURIComponent('Запрос: '+car.name)}">Запросить информацию <span>↗</span></a></aside></div>
  <div class="detail-story"><p class="eyebrow">LA STORIA</p><h2>У этой находки есть характер.</h2><p>${esc(car.story || 'Подробное описание, история владения, документы и результаты осмотра — по запросу.')}</p></div>
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
  document.getElementById('gallery-main-image').srcset = photoSrcset(car, 1);
}

function showPhoto(car, n){
  const main = document.getElementById('gallery-main-image');
  delete main.dataset.fallback;               // allow the placeholder logic to run again
  main.srcset = photoSrcset(car, n);
  main.sizes = SIZES_MAIN;
  main.src = photoUrl(car, n, 1200);
}

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
  if (thumb) {
    const car = cars.find(c => c.id === thumb.closest('.detail-shell').dataset.car);
    showPhoto(car, Number(thumb.dataset.n));
    document.querySelectorAll('.gallery-thumb').forEach(b => b.classList.remove('active'));
    thumb.classList.add('active');
  }
});
document.addEventListener('keydown', e => {
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
