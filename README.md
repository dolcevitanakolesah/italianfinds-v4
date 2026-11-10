# Italian Finds — static website prototype

A responsive Russian-language classic-car showcase with an Italian editorial visual direction.

## Run locally
Open `index.html` in a browser, or run a local static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to Cloudflare Pages
1. Create a GitHub repository and push the contents of this folder to its root.
2. In Cloudflare, open **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository.
4. Framework preset: **None**.
5. Build command: leave empty.
6. Build output directory: `/` (repository root).
7. Deploy.

No build step or server-side runtime is required.

## The car list: `cars.txt`
The cars on the site, and their order, come from `cars.txt` in the root (next to `index.html`). One car per line:

```
Model-Year-Place
Bianchina-1962-Rimini
```

Empty lines and lines starting with `#` are ignored. To add, remove or reorder cars, just edit this file.

Optional display names, categories (for the filters) and extra details (price, mileage, engine…) can be added per model in the `CAR_INFO` object at the top of `app.js`. Without an entry the model name is prettified automatically ("FulviaHF" → "Fulvia HF").

> Because the list is loaded with `fetch`, open the site through a web server (`python3 -m http.server`) — double-clicking `index.html` will not load the list. Cloudflare Pages works as is.

## Car data: `<folder>/<folder>-00-Card.txt`
Each car folder holds a text file with that car's data, named like the folder plus `-00-Card.txt`:

```
title: С солнцем Сицилии:1962 Bianchina Cabrio
imageAlt: Bianchina Cabrio
series: n/a
year: 1962
mileage: 64,000 km
displacement: 499 cc
power: 18 HP
transmission: 4-speed manual
price: 19,000 €

description:
Text of the listing. May run over several lines;
a blank line starts a new paragraph.

history: Text of the car's history.
```

- A key is a lowercase word followed by a colon at the start of a line. `n/a`, `-` or an empty value means "not shown".
- `title` is the heading (the part after the first `:` is shown in italics on the car page), `imageAlt` is the photo alt text, `displacement` → "Двигатель", `transmission` → "Коробка передач". `description` and `history` are the text blocks on the car page.
- Optional extra keys: `category` (`coupe`, `spider` or `saloon`, used by the home page filters), `fuel`, `drive`, `condition`.
- If the file is missing, the car still appears (name from `cars.txt`, no specs).

## Other content
- Hero and manifesto images: `assets/Home/` (`Hero-01-*.webp`, `Manifesto-01-*.webp`). Their brightness, saturation and contrast are set in `assets/Home/Home-Settings.txt` (percent, 100 = unchanged).
- Contact email: replace `ciao@italianfinds.example` in `index.html` and `app.js`.
- Brand colours and typography: CSS variables at the top of `styles.css`.

## Car photos
Photos live in `assets/`, one subfolder per car. The folder name is the **whole line from `cars.txt`** and is also the file prefix:

```
assets/Bianchina-1962-Rimini/Bianchina-1962-Rimini-01-0300.webp
assets/Bianchina-1962-Rimini/Bianchina-1962-Rimini-01-0600.webp
assets/Bianchina-1962-Rimini/Bianchina-1962-Rimini-01-1200.webp
assets/Bianchina-1962-Rimini/Bianchina-1962-Rimini-01-1920.webp   (optional)
assets/Bianchina-1962-Rimini/Bianchina-1962-Rimini-02-0300.webp
...
```

- `NN` is the photo number (two digits). Photo `01` is the cover shown on the home page.
- The last number is the width in pixels, always four digits: `0300`, `0600`, `1200` are required for every photo; `1920` is optional and may exist for only some photos.
- Folder and file names are **case-sensitive** on Cloudflare Pages.
- No need to declare how many photos there are: the site tries `01`, `02`, `03`… and stops at the first missing one, so number photos without gaps. A missing photo shows a "Foto in arrivo" placeholder.
- On the car page the photos appear as one horizontally scrolling thumbnail strip under the main photo (swipe, arrows, ← → keys). 1920 versions are loaded only for the photo being viewed.

## Important
All cars, prices, mileage, specifications, and image assignments are illustrative placeholders. The remote photos are generic visual placeholders and may not depict the named model. Replace them with verified photographs and accurate vehicle details before publishing real offers.

The site uses hash-based client-side routes (`#/car/<id>`), so individual vehicle pages work on a static host without rewrite rules.
