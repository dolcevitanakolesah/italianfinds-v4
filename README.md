# Italian Finds

Static website showcasing classic Italian cars found in Italy, for Russian-speaking buyers. No build step, no dependencies.

## Structure
- `index.html` – page shell
- `css/style.css` – styling
- `js/cars.js` – the car catalogue (edit this to add cars)
- `js/app.js` – rendering, routing (`#car-id`), RU/EN texts
- `images/` – your real photos

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` and visit http://localhost:8000

## Deploy
**GitHub:** create a repo, upload the contents of this folder, then Settings > Pages > deploy from branch `main` / root (optional test site).

**Cloudflare Pages:** Workers & Pages > Create > Pages > Connect to Git > pick the repo. Framework preset: None. Build command: empty. Output directory: `/`.

## Add a car
Copy an entry in `js/cars.js` and change `id` (unique, letters/digits/hyphens), name, year, mileage, etc. Fields: `km` mileage, `cc` displacement, `hp` power, `g` number of gears, `p` price in EUR, `l` [English, Russian] region, `tag` (`barn`, `garage`, `orig`), `d` [English, Russian] description.

## Replace placeholder images with real photos
Currently images are generated illustrations (`img()` in `js/app.js`). Add a `photos` array to a car, e.g. `photos:["images/giulietta-1.jpg","images/giulietta-2.jpg"]`, and change `img(c,i)` to return `<img src="${c.photos[i]}" alt="${c.n}" loading="lazy" style="width:100%;height:100%;object-fit:cover">` when `c.photos` exists. Ask Claude to do this edit for you if you prefer.

Contact details (Telegram handle, email) are placeholders in `js/app.js` and `index.html`.
