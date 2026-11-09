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

## Replace the demo content
- Car listings and specifications: `app.js`, in the `cars` array.
- Car photos: see **Car photos** below (folder `assets/`).
- Hero and manifesto imagery: image URLs in `styles.css`.
- Contact email: replace `ciao@italianfinds.example` in `index.html` and `app.js`.
- Brand colours and typography: CSS variables at the top of `styles.css`.

## Car photos
Photos live in `assets/`, one subfolder per car. The folder name is also the file prefix:

```
assets/Bianchina-Red-Ferrara/Bianchina-Red-Ferrara-01-0300.webp
assets/Bianchina-Red-Ferrara/Bianchina-Red-Ferrara-01-0600.webp
assets/Bianchina-Red-Ferrara/Bianchina-Red-Ferrara-01-1200.webp
assets/Bianchina-Red-Ferrara/Bianchina-Red-Ferrara-01-1920.webp   (optional)
assets/Bianchina-Red-Ferrara/Bianchina-Red-Ferrara-02-0300.webp
...
```

- `NN` is the photo number (two digits). Photo `01` is the cover shown on the home page.
- The last number is the width in pixels, always four digits: `0300`, `0600`, `1200`. Every photo needs these three.
- `1920` is optional and may exist for only some photos.
- Folder and file names are **case-sensitive** on Cloudflare Pages.

A static site cannot list a folder, so each car in `app.js` declares its photos:

```js
{id:"bianchina", folder:"Bianchina-Red-Ferrara", photos:8, hd:[1,2,5], name:"…", …}
```

`photos` is how many numbered photos exist, and `hd` lists the photo numbers that also have a `-1920` version. The browser picks the best size automatically (`srcset`). If a file is missing, a neutral "Foto in arrivo" placeholder is shown instead of a broken image.

## Important
All cars, prices, mileage, specifications, and image assignments are illustrative placeholders. The remote photos are generic visual placeholders and may not depict the named model. Replace them with verified photographs and accurate vehicle details before publishing real offers.

The site uses hash-based client-side routes (`#/car/<id>`), so individual vehicle pages work on a static host without rewrite rules.
