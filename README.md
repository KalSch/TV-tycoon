# TV Station Tycoon v1.2 — PWA hotfix

This build fixes the blank-screen startup failure in v1.1 and improves recovery/debugging.

## What changed
- Replaced the malformed/minified startup JavaScript with readable validated JavaScript.
- Added defensive local-save loading and migration defaults.
- Added a visible startup error screen instead of a silent blank page.
- Versioned CSS/JS requests and service-worker cache as `1.2.0`.
- Service worker deletes older caches on activation and prefers fresh network assets.
- Keeps relative paths for GitHub Pages project hosting under `/TV-tycoon/`.

## Deploy to GitHub Pages
Replace the repository root files with the files in this package, preserving the `icons/` folder. Commit the changes and let GitHub Pages deploy.

After deployment, open the Pages URL in Safari. If an old installed Home Screen copy is open, close it and first load the Pages URL in Safari so the new service worker can activate.
