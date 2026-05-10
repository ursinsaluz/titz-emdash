# titz.cooking — Agent Reference

This is an EmDash site -- a CMS built on Astro with a full admin UI, deployed on Cloudflare.
Live URL: [https://emdash.titz.cooking](https://emdash.titz.cooking)

## Architecture

- **Rendering**: All pages use `output: "server"` (Astro SSR).
- **Navigation**: Uses `src/components/TzNav.astro`. It dynamically loads the menu named `main`.
- **Theme Settings**: A singleton collection `theme_settings` controls global elements (logo, CTA).
- **Sub-pages**: Dynamically resolved via `src/pages/[slug].astro`. Specialized templates like `stationen.astro` exist for custom layouts.

## Alpin-editoriales Design System

- **Typography**: 
  - Serif: `Fraunces` (Display/Headings).
  - Sans: `Inter Tight` (Body/UI).
  - Mono: `JetBrains Mono` (Labels/Coordinates).
- **Color Palette**:
  - `--paper`: `#F4EFE7` (Primary background).
  - `--ink`: `#1a1a18` (Primary text/Dark background).
  - `--ember`: `oklch(0.62 0.14 45)` (Accent).
- **Navigation Modes**:
  - `light`: White text for dark headers (Hero sections).
  - `dark`: Dark text for light backgrounds (Sub-pages).

## Commands

```bash
npx emdash dev        # Local dev with DB
npm run deploy        # Deploy to Cloudflare
npx emdash seed       # Update local DB from seed.json
```

## Knowledge Base

- **404 Handling**: Handled by `src/pages/404.astro`. It fetches content from the `404` slug in the CMS.
- **Image Reveal**: Use `.grayscale .group-hover:grayscale-0` for consistent photography effects.
- **Internal Anchors**: Main sections use `philosophie`, `restaurant`, `news`.
- **External Links**: Use `target="_blank" rel="noopener noreferrer"` for news/press items.
