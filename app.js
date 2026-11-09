/* ------------------------------------------------------------------
   PHOTO LIBRARY
   Each car has a folder in /assets named exactly like car.folder:

     assets/<folder>/<folder>-<NN>-<WIDTH>.webp

   NN    = photo number, two digits (01, 02, ...)
   WIDTH = horizontal resolution, four digits: 0300, 0600, 1200
           and, for some photos only, 1920.

   Per car:
     folder : folder name AND file prefix (case-sensitive on the server!)
     photos : how many numbered photos exist (01 is the cover)
     hd     : photo numbers that ALSO have a -1920 version, e.g. [1, 2]
   ------------------------------------------------------------------ */
const cars = [
 {id:"giulia-gt",folder:"Giulia-GT-Junior-Blue-Bologna",photos:4,hd:[1],name:"Alfa Romeo Giulia GT 1300 Junior",short:"GT 1300 Junior",year:"1972",category:"coupe",tag:"SCOPERTA RECENTE",price:"€ 28.500",mileage:"78.000 km",power:"89 CV",engine:"1.290 cm³",gearbox:"Механика, 5 ступеней",fuel:"Бензин",drive:"Задний привод",location:"Эмилия-Романья",condition:"На ходу · требует внимания",story:"Небольшое купе с пропорциями, которые не нуждаются в объяснениях. Автомобиль представлен как пример карточки Italian Finds: фотографии и характеристики здесь демонстрационные, а не описание реального лота."},
 {id:"giulietta-spider",folder:"Giulietta-Spider-Red-Siena",photos:4,hd:[1],name:"Alfa Romeo Giulietta Spider",short:"Giulietta Spider",year:"1961",category:"spider",tag:"ICONA ITALIANA",price:"€ 64.000",mileage:"52.400 km",power:"80 CV",engine:"1.290 cm³",gearbox:"Механика, 4 ступени",fuel:"Бензин",drive:"Задний привод",location:"Тоскана",condition:"Проект реставрации",story:"Открытый автомобиль для длинных дорог вдоль побережья. Эта демонстрационная карточка показывает, как можно рассказать историю машины и вынести ключевые параметры в отдельный блок."},
 {id:"fiat-124",folder:"124-Sport-Spider-Yellow-Genova",photos:4,hd:[1],name:"Fiat 124 Sport Spider",short:"124 Sport Spider",year:"1974",category:"spider",tag:"DOLCE VITA",price:"€ 22.900",mileage:"91.000 km",power:"90 CV",engine:"1.756 cm³",gearbox:"Механика, 5 ступеней",fuel:"Бензин",drive:"Задний привод",location:"Лигурия",condition:"Хорошая база для поездок",story:"Лёгкий итальянский спайдер, созданный для удовольствия от дороги. В реальной публикации здесь появятся проверенная история, список выполненных работ и подробности осмотра."},
 {id:"lancia-fulvia",folder:"Fulvia-Coupe-Green-Torino",photos:4,hd:[1],name:"Lancia Fulvia Coupé 1.3 S",short:"Fulvia Coupé 1.3 S",year:"1973",category:"coupe",tag:"SPORTIVA",price:"€ 19.800",mileage:"68.000 km",power:"90 CV",engine:"1.298 cm³",gearbox:"Механика, 5 ступеней",fuel:"Бензин",drive:"Передний привод",location:"Пьемонт",condition:"Сохранившийся оригинал",story:"Fulvia — одна из самых самобытных моделей своего времени. Демонстрационный пример показывает подачу компактного купе с акцентом на происхождение и технические детали."},
 {id:"fiat-500",folder:"Fiat-500L-Cream-Verona",photos:4,hd:[1],name:"Fiat 500 L",short:"500 L",year:"1971",category:"saloon",tag:"PICCOLA GRANDE",price:"€ 8.900",mileage:"44.000 km",power:"18 CV",engine:"499 cm³",gearbox:"Механика, 4 ступени",fuel:"Бензин",drive:"Задний привод",location:"Венето",condition:"На ходу · ухоженный",story:"Маленькая машина с огромным характером. Здесь можно разместить историю владения, сведения о документах и короткий список того, что стоит проверить перед покупкой."},
 {id:"alfetta",folder:"Alfetta-Silver-Milano",photos:4,hd:[1],name:"Alfa Romeo Alfetta 1.8",short:"Alfetta 1.8",year:"1978",category:"saloon",tag:"BERLINA CLASSICA",price:"€ 14.500",mileage:"83.500 km",power:"122 CV",engine:"1.779 cm³",gearbox:"Механика, 5 ступеней",fuel:"Бензин",drive:"Задний привод",location:"Ломбардия",condition:"Хорошее состояние",story:"Элегантный седан для тех, кто ценит инженерную школу Alfa Romeo. В карточке реального автомобиля будут указаны VIN, документы, история обслуживания и результаты осмотра."}
];

/* ---------- image helpers ---------- */
const pad = (n, len) => String(n).padStart(len, '0');
const photoCount = car => car.photos || 1;
const photoUrl = (car, n, w) => encodeURI(`assets/${car.folder}/${car.folder}-${pad(n, 2)}-${pad(w, 4)}.webp`);
// 300 / 600 / 1200 always; 1920 only for photos listed in car.hd
const photoWidths = (car, n, max = 1920) =>
  [300, 600, 1200, ...((car.hd || []).includes(n) ? [1920] : [])].filter(w => w <= max);
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

/* ---------- rendering ---------- */
const app = document.getElementById('app');
const grid = document.getElementById('car-grid');
const HOME_SECTIONS = ['.hero', '.intro-strip', '.collection', '.manifesto', '.contact-band', '.method'];

function cardMarkup(car){return `<article class="car-card" data-category="${car.category}" data-id="${car.id}" tabindex="0" role="link" aria-label="Открыть ${car.name}">
  <div class="car-image-wrap"><img class="car-image" src="${photoUrl(car,1,600)}" srcset="${photoSrcset(car,1,1200)}" sizes="${SIZES_CARD}" alt="${car.name}" loading="lazy" decoding="async"><span class="car-tag">${car.tag}</span></div>
  <div class="car-card-top"><span class="car-year">${car.year} · ${car.location.toUpperCase()}</span><span class="car-price">${car.price}</span></div>
  <h3>${car.name}</h3><div class="car-meta"><span>${car.mileage}</span><span>${car.power}</span><span>${car.gearbox.split(',')[0]}</span></div>
  <span class="card-arrow">СМОТРЕТЬ АВТОМОБИЛЬ <span>↗</span></span></article>`}

function renderGrid(filter='all'){grid.innerHTML=cars.filter(c=>filter==='all'||c.category===filter).map(cardMarkup).join('');}

function thumbsMarkup(car){
  if (photoCount(car) < 2) return '';
  let html = '';
  for (let n = 1; n <= photoCount(car); n++) {
    html += `<button class="gallery-thumb ${n===1?'active':''}" data-n="${n}" aria-label="Фото ${n}"><img src="${photoUrl(car,n,300)}" srcset="${photoSrcset(car,n,600)}" sizes="${SIZES_THUMB}" alt="" loading="lazy" decoding="async"></button>`;
  }
  return `<div class="gallery-thumbs">${html}</div>`;
}

function detailMarkup(car){return `<section class="detail-shell" data-car="${car.id}">
  <a class="back-link" href="#/"><span>←</span> НАЗАД К НАХОДКАМ</a>
  <div class="detail-title-row"><div><p class="eyebrow">TROVATA IN ITALIA · ${car.year}</p><h1>${car.name.replace(' ', ' <em>')}</em></h1></div><div class="detail-price">${car.price}</div></div>
  <div class="detail-layout"><div><div class="gallery-main"><img id="gallery-main-image" src="${photoUrl(car,1,1200)}" srcset="${photoSrcset(car,1)}" sizes="${SIZES_MAIN}" alt="${car.name} — фотография"></div>${thumbsMarkup(car)}</div>
  <aside class="spec-card"><p class="eyebrow">SCHEDA TECNICA</p><h2>Характеристики</h2><dl class="spec-list">
  <div class="spec-row"><dt>Год выпуска</dt><dd>${car.year}</dd></div><div class="spec-row"><dt>Пробег</dt><dd>${car.mileage}</dd></div><div class="spec-row"><dt>Двигатель</dt><dd>${car.engine}</dd></div><div class="spec-row"><dt>Мощность</dt><dd>${car.power}</dd></div><div class="spec-row"><dt>Коробка передач</dt><dd>${car.gearbox}</dd></div><div class="spec-row"><dt>Топливо</dt><dd>${car.fuel}</dd></div><div class="spec-row"><dt>Привод</dt><dd>${car.drive}</dd></div><div class="spec-row"><dt>Местонахождение</dt><dd>${car.location}</dd></div><div class="spec-row"><dt>Состояние</dt><dd>${car.condition}</dd></div></dl>
  <p class="spec-note">Цена указана для примера. Финальные условия, документы, осмотр и логистика обсуждаются индивидуально.</p><a class="button button-dark" href="mailto:ciao@italianfinds.example?subject=${encodeURIComponent('Запрос: '+car.name)}">Запросить информацию <span>↗</span></a></aside></div>
  <div class="detail-story"><p class="eyebrow">LA STORIA</p><h2>У этой находки есть характер.</h2><p>${car.story}</p></div>
  <p class="detail-disclaimer">ДЕМОНСТРАЦИОННЫЙ МАКЕТ · Автомобиль, изображения, пробег, характеристики и цена приведены только для визуального примера и не являются предложением о продаже.</p>
  </section>`}

function setHomeVisible(visible){
  HOME_SECTIONS.forEach(sel => { const el = document.querySelector(sel); if (el) el.style.display = visible ? '' : 'none'; });
}

function renderRoute(){
  const id = location.hash.match(/^#\/car\/(.+)$/)?.[1];
  if (!id) { setHomeVisible(true); renderGrid(); window.scrollTo(0,0); return; }
  const car = cars.find(c => c.id === id);
  if (!car) { location.hash = '#/'; return; }
  setHomeVisible(false);
  const old = document.querySelector('.detail-shell');
  if (old) old.remove();
  app.insertAdjacentHTML('afterbegin', detailMarkup(car));
  window.scrollTo(0,0);
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
renderRoute();
