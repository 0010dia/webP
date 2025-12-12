<!-- Copilot instructions for AI coding agents working on this repo -->
# Project quick orientation

- **Primary app folder**: `app/` — a Create React App project (see `app/package.json`).
- **Entry points**: `app/src/Main.js` (router + render) and `app/src/App.js` (layout + routes).
- **Routing**: Uses `react-router-dom` (v6). `App.js` redirects `/` → `/list` and mounts `ListPage` at `/list`.
- **Styling patterns**: two coexisting approaches:
  - `styled-components` used in `app/src/components/MainBanner.js` (see `MainBanner` styled components).
  - Inline JS styles are used widely (see `app/src/page/ListPage.js` where `styles` object and inline `style` props are used).
- **Static assets**: images live under `app/public/img/` and are referenced as `/img/<name>.avif` (e.g. `products[*].image` in `ListPage`).

# Developer workflows (exact commands)

- Install dependencies: `cd app && npm install`.
- Start development server: `cd app && npm start` (dev server on `http://localhost:3000`).
- Run tests: `cd app && npm test` (Create React App test runner).
- Build for production: `cd app && npm run build` → output in `app/build/`.

# Key files to inspect for changes

- `app/src/Main.js` — root render; wraps `App` with `BrowserRouter`.
- `app/src/App.js` — main layout and route definitions (redirects `/` → `/list`).
- `app/src/page/ListPage.js` — product list, mock data, filters, inline styles; frequently edited for UI/UX.
- `app/src/components/MainBanner.js` — example of `styled-components` usage and component structure.
- `app/public/img/` — static images referenced by components; keep filenames and references in sync.

# Discoverable patterns & conventions (concrete)

- Mock data often lives inside components: e.g. `ListPage` declares `products`, `materials`, and `sizeOptions` arrays. Edit these to change demo content rather than wiring up a backend.
- Images are referenced by absolute path (`/img/1.avif`). When testing locally, ensure files exist under `app/public/img`.
- Styling: prefer to follow the file's existing pattern. If a file already uses `styled-components` (like `MainBanner`), add styles there; if it uses inline `styles` objects (like `ListPage`), continue that pattern in the same file.
- Routing: keep route components as elements in `Routes` (React Router v6). Example: <Route path="/list" element={<ListPage />} /> (see `App.js`).

# Dependencies & integration points

- `styled-components` is a direct dependency—used in at least one component (`MainBanner`).
- `react-router-dom` v6 is used for client-side routing — don't mix v5 patterns (no `Switch`, use `Routes`).
- No backend is present in this repository; product data is client-side mock data. If you add API integrations, place client code under `app/src/` and keep mock arrays for local dev.

# Quick editing examples

- Update demo product price in `ListPage` by editing `products[2].price`.
- Add a new image: put `7.avif` in `app/public/img/` and reference `/img/7.avif` from `products` or components.

# Tests & linting

- There are no custom test suites beyond CRA defaults. Use `cd app && npm test` to run tests.

# When to open a PR (and what reviewers expect)

- Small UI tweaks: one-file changes (component + optional asset). Keep styling approach consistent with the file.
- Data changes: update mock arrays in `ListPage` or create a small fixture under `app/src/__fixtures__/` and import it.

# If something is unclear

- Ask for where to place data vs. API integration. Mention which files you plan to change (e.g. `app/src/page/ListPage.js`) and whether to add new dependencies.

---
Please review and tell me if you'd like additional examples or expanded guidance (tests, CI, or API integration patterns).