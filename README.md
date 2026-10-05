# TV Station Tycoon v1.1 — Deployment-ready PWA

## Run locally
A PWA must be served over HTTP/HTTPS; do not double-click index.html for full PWA behavior.

Python:
`python3 -m http.server 8080`
Then open `http://localhost:8080/`.

## Deploy
Upload the contents of this folder to any static HTTPS host (GitHub Pages, Netlify, Cloudflare Pages, Vercel static hosting, etc.). No build step is required.

## iPhone/iPad install
Open the deployed HTTPS URL in Safari, tap Share, then **Add to Home Screen**.

## PWA contents
- Web app manifest with standard and maskable icons
- Apple touch icon/mobile metadata
- Service worker with app-shell caching
- Relative paths so the app works from a subdirectory
- Persistent game saves remain handled by the game code in the browser

## Version
PWA packaging: 1.1.0
Game prototype: v1
