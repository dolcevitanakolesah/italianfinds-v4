# Italian Finds

Static website showcasing classic Italian cars found in Italy, for Russian-speaking buyers. No build step, no dependencies.

## Structure
- `index.html` – page shell
- `css/style.css` – styling
- `js/cars.js` – the car catalogue (edit this to add cars)
- `js/app.js` – rendering, routing (`#car-id`), RU/EN texts
- `assets/` – your real photos, one subfolder per car

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` and visit http://localhost:8000

## Deploy
**GitHub:** create a repo, upload the contents of this folder, then Settings > Pages > deploy from branch `main` / root (optional test site).

**Cloudflare Pages:** Workers & Pages > Create > Pages > Connect to Git > pick the repo. Framework preset: None. Build command: empty. Output directory: `/`.

## Add a car
1. Create `assets/<Folder>/` (e.g. `assets/Bianchina-Red-Ferrara/`) and put the photos in it as `<Folder>-NN-WWWW.webp`, with WWWW = `0300`, `0600`, `1200` for every photo, plus an optional `1920`. See `assets/README.txt`. File names are case-sensitive.
2. Copy an entry in `js/cars.js` and set: `id` (unique, lowercase, letters/digits/hyphens), `folder`, `photos` (how many numbered photos), `hi` (numbers of the photos that also have a 1920 version, e.g. `[1,2]`), name `n`, year `y`, mileage `km`, displacement `cc`, power `hp`, gears `g`, price `p` (EUR), region `l` [English, Russian], `tag` (`barn`, `garage`, `orig`), condition `st` and description `d` [English, Russian].

Photo 01 is the cover on the home page. The browser picks 300/600/1200/1920 automatically depending on the screen. If a file is missing, an illustration is shown instead. The sample cars without a `folder` still use illustrations; delete them when you have real cars.

Contact details (Telegram handle, email) are placeholders in `js/app.js` and `index.html`.
