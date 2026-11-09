const $=s=>document.querySelector(s);
let lang="en";try{lang=localStorage.getItem("lang")||"en"}catch(e){}
const T={en:{eye:"Scoperte · Classiche · Italiane",h:"Forgotten Italian beauties, waiting for a second life",sub:"Classic cars found in barns and garages across Italy, offered to collectors in Russia.",cta:"See the collection",v1:"Found in Italy",v1p:"Sourced on the ground: barns, garages and private collections.",v2:"Honest photos",v2p:"What you see is what you get. Patina is part of the story.",v3:"Paperwork & transport",v3p:"Guidance on documents and delivery, from the first call.",coll:"Latest finds",collp:"Each car is one of a kind. Click a photo to see the details.",back:"← All cars",price:"Asking price",year:"Year",km:"Mileage",cc:"Engine displacement",hp:"Power",gear:"Gearbox",loc:"Found in",cond:"Condition",enq:"Enquire on Telegram",mail:"or send an email",barn:"Barn find",garage:"Garage find",orig:"Original",u:{km:"km",hp:"hp",cc:"cc"},ft:"Classic Italian cars, found in Italy."},
ru:{eye:"Scoperte · Classiche · Italiane",h:"Забытые итальянские красавцы ждут новой жизни",sub:"Классические автомобили, найденные в амбарах и гаражах по всей Италии, для коллекционеров из России.",cta:"Смотреть коллекцию",v1:"Найдено в Италии",v1p:"Поиск на месте: амбары, гаражи и частные коллекции.",v2:"Честные фото",v2p:"Всё как есть. Патина — часть истории автомобиля.",v3:"Документы и доставка",v3p:"Поможем с документами и логистикой с первого звонка.",coll:"Свежие находки",collp:"Каждый автомобиль — единственный в своём роде. Нажмите на фото, чтобы узнать больше.",back:"← Все автомобили",price:"Цена",year:"Год",km:"Пробег",cc:"Объём двигателя",hp:"Мощность",gear:"Коробка передач",loc:"Где найден",cond:"Состояние",enq:"Написать в Telegram",mail:"или отправить письмо",barn:"Из амбара",garage:"Из гаража",orig:"Оригинал",u:{km:"км",hp:"л.с.",cc:"см³"},ft:"Классические итальянские автомобили, найденные в Италии."}};
const t=k=>T[lang][k],li=()=>lang==="ru"?1:0;
let n=0;
function scene(v,g,hero){
let o=`<defs><linearGradient id="s${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2b36e"/><stop offset="1" stop-color="#f6e2bb"/></linearGradient></defs>`;
if(v==="tuscan"){
o+=(hero?"":`<rect x="-300" y="-300" width="1000" height="800" fill="url(#s${g})"/>`)+`<circle cx="300" cy="100" r="36" fill="#f7a940" opacity=".85"/><path d="M-300 150Q-100 100 60 140T300 130T700 150V300H-300Z" fill="#9aa860"/><path d="M-300 165Q0 130 200 160T700 160V300H-300Z" fill="#7f9347"/>`;
[[40,118],[62,124],[356,120],[378,126]].forEach(a=>o+=`<ellipse cx="${a[0]}" cy="${a[1]}" rx="7" ry="34" fill="#2f4a2b"/>`);
o+=`<rect x="-300" y="172" width="1000" height="300" fill="#cdb98f"/>`;
}else if(v==="barn"){
o+=`<rect x="-300" y="-300" width="1000" height="800" fill="#2e1f15"/>`;
for(let i=-300;i<700;i+=26)o+=`<line x1="${i}" y1="-300" x2="${i}" y2="500" stroke="#1d130c" stroke-width="3"/>`;
o+=`<polygon points="40,0 150,0 340,196 110,196" fill="#ffd88a" opacity=".2"/><rect x="-300" y="172" width="1000" height="300" fill="#3a281c"/><rect x="326" y="146" width="48" height="30" fill="#d6b055"/><rect x="334" y="124" width="40" height="22" fill="#c9a045"/>`;
}else{
o+=`<rect x="-300" y="-300" width="1000" height="800" fill="#d8cfba"/>`;
for(let i=0;i<172;i+=18)o+=`<line x1="-300" y1="${i}" x2="700" y2="${i}" stroke="#c4b99f" stroke-width="2"/>`;
o+=`<rect x="28" y="34" width="14" height="30" fill="#008c45"/><rect x="42" y="34" width="14" height="30" fill="#fff"/><rect x="56" y="34" width="14" height="30" fill="#cd212a"/><rect x="300" y="40" width="70" height="60" fill="#a9c4d0" stroke="#8b7e66" stroke-width="4"/><rect x="-300" y="172" width="1000" height="300" fill="#8e8777"/>`;
}
return o}
function img(c,i){
const g=++n,sc=["tuscan","barn","garage"],alt=sc[(sc.indexOf(c.s)+1)%3];
const v=[[c.s,"0 0 400 300"],[alt,"0 0 400 300"],[c.s,"236 84 150 112"],[alt,"20 100 150 112"]][i];
return `<svg viewBox="${v[1]}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${c.n}">${scene(v[0],g)}${car(c.c,g)}</svg>`}
function car(c,g){
return `<defs><path id="b${g}" d="M38 160V140Q40 128 66 124L128 118Q150 92 192 88H244Q272 92 290 116L342 122Q366 126 368 144V160Z"/><linearGradient id="h${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient></defs>
<ellipse cx="203" cy="198" rx="190" ry="7" fill="#000" opacity=".25"/>
<use href="#b${g}" fill="${c}"/><use href="#b${g}" fill="url(#h${g})"/>
<path d="M150 118Q165 98 194 96H238Q258 98 272 118Z" fill="#20262b" opacity=".85"/>
<line x1="44" y1="140" x2="362" y2="140" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>
<rect x="38" y="132" width="6" height="10" fill="#cc2b2b"/><circle cx="355" cy="136" r="7" fill="#f7e9b0"/>
${[100,306].map(x=>`<circle cx="${x}" cy="170" r="30" fill="#17120e"/><circle cx="${x}" cy="170" r="26" fill="#111"/><circle cx="${x}" cy="170" r="15" fill="#d5d5d5"/><circle cx="${x}" cy="170" r="5" fill="#777"/>`).join("")}`}
const price=p=>lang==="ru"?p.toLocaleString("ru-RU")+" €":"€"+p.toLocaleString("en-GB");
const nf=x=>x.toLocaleString(lang==="ru"?"ru-RU":"en-GB");
const gearTxt=g=>lang==="ru"?g+"-ступенчатая механика":g+"-speed manual";
const card=c=>`<a class="card" href="#${c.id}"><div class="ph">${img(c,0)}<span class="tag">${t(c.tag)}</span></div><div class="cb"><h3>${c.n}</h3><p>${c.y} · ${c.l[li()]}</p><b>${price(c.p)}</b></div></a>`;
function home(){return `<section class="hero"><div class="txt"><div class="eyebrow">${t("eye")}</div><h1>${t("h")}</h1><p>${t("sub")}</p><a class="btn" href="#collection" onclick="event.preventDefault();document.getElementById('collection').scrollIntoView({behavior:'smooth'})">${t("cta")}</a></div><svg viewBox="10 60 380 150" preserveAspectRatio="xMidYMax meet">${scene("tuscan",0,true)}${car("#b3202a",0)}</svg></section>
<div class="vals"><div><h3>${t("v1")}</h3><p>${t("v1p")}</p></div><div><h3>${t("v2")}</h3><p>${t("v2p")}</p></div><div><h3>${t("v3")}</h3><p>${t("v3p")}</p></div></div>
<div class="wrap" id="collection"><div class="sec"><div class="orn">◆ ◆ ◆</div><h2>${t("coll")}</h2><p>${t("collp")}</p></div><div class="grid">${cars.map(card).join("")}</div></div>`}
function page(c){const r=(k,v)=>`<div><dt>${t(k)}</dt><dd>${v}</dd></div>`,u=t("u");
return `<div class="wrap"><a class="back" href="#">${t("back")}</a><div class="car"><div><div class="ph big" id="main">${img(c,0)}</div><div class="th">${[0,1,2,3].map(i=>`<button data-i="${i}" class="${i?"":"on"}" aria-label="${i+1}">${img(c,i)}</button>`).join("")}</div><p class="desc">${c.d[li()]}</p></div>
<aside class="spec"><h1>${c.n}</h1><div style="margin:18px 0 4px" class="pl">${t("price")}</div><div class="price">${price(c.p)}</div><dl>${r("year",c.y)}${r("km",nf(c.km)+" "+u.km)}${r("cc",nf(c.cc)+" "+u.cc)}${r("hp",c.hp+" "+u.hp)}${r("gear",gearTxt(c.g))}${r("loc",c.l[li()])}${r("cond",c.st[li()])}</dl><a class="btn g" href="https://t.me/italianfinds">${t("enq")}</a><a class="alt" href="mailto:info@italianfinds.example">${t("mail")}</a></aside></div></div>`}
function render(){
const c=cars.find(x=>x.id===location.hash.slice(1));
document.documentElement.lang=lang;$("#lang").textContent=lang==="ru"?"EN":"RU";$("#ft1").textContent=t("ft");
$("#app").innerHTML=c?page(c):home();document.title=(c?c.n+" – ":"")+"Italian Finds";
if(c)window.scrollTo(0,0)}
document.addEventListener("click",e=>{const b=e.target.closest(".th button");if(!b)return;
$("#main").innerHTML=b.innerHTML;document.querySelectorAll(".th button").forEach(x=>x.classList.toggle("on",x===b))});
$("#lang").onclick=()=>{lang=lang==="ru"?"en":"ru";try{localStorage.setItem("lang",lang)}catch(e){}render()};
window.addEventListener("hashchange",render);render();
