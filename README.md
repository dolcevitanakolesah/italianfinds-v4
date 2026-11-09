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

## Other content
- Hero image: `assets/hero-barn.webp` (set in `styles.css`). Manifesto image: URL in `styles.css`.
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

## Important
All cars, prices, mileage, specifications, and image assignments are illustrative placeholders. The remote photos are generic visual placeholders and may not depict the named model. Replace them with verified photographs and accurate vehicle details before publishing real offers.

The site uses hash-based client-side routes (`#/car/<id>`), so individual vehicle pages work on a static host without rewrite rules.
