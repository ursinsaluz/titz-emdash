# titz.cooking — Project Context

This project is a redesign and port of `titz.cooking`, built as a high-performance web application using **Astro** and **EmDash CMS**, deployed on the **Cloudflare** platform.

## Project Overview

- **Framework:** [Astro](https://astro.build/) (Server-rendered on Cloudflare Workers)
- **CMS:** [EmDash CMS](https://github.com/emdash-cms/emdash) (Headless, Git-integrated schema)
- **Infrastructure:** 
  - **Runtime:** Cloudflare Workers
  - **Database:** Cloudflare D1 (SQL)
  - **Media Storage:** Cloudflare R2
- **Styling:** Tailwind CSS v4 with custom design tokens based on a "Spices & Paper" metaphor.
- **Design Reference:** Aligned 1:1 with `tinacms.titz.cooking` (Minimalist, Serif-heavy, high-contrast dark/light sections).

## Tech Stack & Architecture

- **Rendering:** Hybrid (mostly SSR via `@astrojs/cloudflare`).
- **Data Fetching:** Uses the `emdash` SDK to query collections (pages, dishes, posts, offers) from D1.
- **Type Safety:** TypeScript with generated types from the EmDash schema (`.emdash/types.ts`).
- **Components:** Modular `.astro` components in `src/components/`.

## Key Directories

- `src/pages/`: Routing logic. `index.astro` is the primary landing page.
- `src/components/`: Reusable UI elements (Nav, Footer, Logo, Arrow, etc.).
- `src/layouts/`: Base HTML templates.
- `src/styles/`: Global CSS and Tailwind theme configuration.
- `public/`: Static assets (images in `img/`, icons).
- `seed/`: Local database seed data (`seed.json`).
- `.emdash/`: CMS configuration and schema definitions.

## Building and Running

### Prerequisites
- Node.js & npm/pnpm.
- Cloudflare account with Wrangler authenticated for deployment.

### Development
```bash
# Install dependencies
npm install

# Start development server (includes EmDash local DB)
npx emdash dev

# Apply/Reset seed data
npx emdash seed seed/seed.json
```

### Build & Deploy
```bash
# Build for production
npm run build

# Deploy to Cloudflare
npm run deploy
```

## Development Conventions

- **Design Tokens:** Use the `--color-*` variables defined in `src/styles/global.css`. Names follow spices (salz, pfeffer, safran, etc.).
- **Typography:** 
  - Serif: `Fraunces` (for displays and emphasis).
  - Sans: `Inter Tight` (for body and navigation).
  - Mono: `JetBrains Mono` (for technical details and corner marks).
- **CMS Access:** Always use `getEmDashEntry` or `getEmDashCollection` from `emdash` for data fetching.
- **Image Handling:** Use the `<Image />` component from `emdash/ui` for CMS-managed images, and standard `<img>` for local static assets in `/public/img/`.

## Core Mandates for Gemini CLI

1. **Maintain Design Fidelity:** Any UI changes must strictly follow the minimalist design language (asymmetric grids, specific padding, consistent use of `tz-display` and `tz-eyebrow`).
2. **Schema Integrity:** Do not modify the database schema without updating `seed/seed.json` and running `npx emdash types` to regenerate interfaces.
3. **Deployment Safety:** Always run `npm run build` before `npm run deploy` to ensure type-safety and successful bundling.
