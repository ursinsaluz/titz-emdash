# titz.cooking — Project Context

This project is a high-performance redesign of `titz.cooking`, built using **Astro** and **EmDash CMS**, deployed on **Cloudflare**.

## Project Overview

- **Framework:** [Astro](https://astro.build/) (Server-rendered on Cloudflare Workers)
- **CMS:** [EmDash CMS](https://github.com/emdash-cms/emdash) (Headless, Git-integrated schema)
- **Mapped Domain:** [https://emdash.titz.cooking](https://emdash.titz.cooking) (Live Admin & Site)
- **Infrastructure:** 
  - **Runtime:** Cloudflare Workers
  - **Database:** Cloudflare D1 (titz-emdash-site)
  - **Media Storage:** Cloudflare R2 (titz-emdash-media)
- **Styling:** Tailwind CSS v4 with custom design tokens.
- **Design:** Editorial style (high-contrast, minimalist, serif display typography).

## Core Design & Components

### Navigation (`TzNav.astro`)
- **Dynamic Menu:** Mapped 1:1 to the `main` menu in EmDash.
- **`navMode` Prop:** Supports `light` (white text for dark backgrounds) and `dark` (dark text for light backgrounds).
- **Configuration:** Logo and CTA Button are managed via the `theme_settings` singleton collection.

### 404 Page
- Fully configurable via the CMS (slug: `404`).
- Inherits the unified project design and header.

## Key Directories

- `src/pages/`: Routing logic. Dynamic pages use `[slug].astro` at the root.
- `src/components/`: Modular UI elements (Nav, Footer, Logo, Arrow, etc.).
- `src/layouts/Base.astro`: Base HTML template. Pass `navMode` here to control header theme.
- `src/styles/`: Global CSS and Tailwind theme.
- `public/img/`: Static design assets and icons.
- `seed/seed.json`: Schema and initial data.

## Building and Running

### Development
```bash
npm install
npx emdash dev        # Starts local server and CMS
npx emdash seed       # Syncs local DB with seed/seed.json
```

### Deploy
```bash
npm run deploy        # Astro build + Wrangler deploy
```

## Development Conventions

- **Colors:** Use CSS variables (`--color-salz`, `--color-pfeffer`, `--color-ember`).
- **Data Fetching:** Use `getEmDashEntry` and `getEmDashCollection`. Always set `Astro.cache.set(cacheHint)`.
- **Links:** All external links in lists (e.g., News) should open in a new tab (`target="_blank"`).

## Core Mandates for Gemini CLI

1. **Maintain Design Fidelity:** UI changes must strictly adhere to the editorial design (specific padding, `tz-display` font-family).
2. **Schema Integrity:** Schema changes require updating `seed/seed.json` and regenerating types via `npx emdash types`.
3. **Header Consistency:** Use the `navMode` prop in `Base.astro` to ensure header visibility across all pages.
4. **Repo Sync:** Ensure all changes are committed and pushed to `main` upon completion of a task.
