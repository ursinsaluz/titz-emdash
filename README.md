# titz.cooking (EmDash Redesign)

A high-performance redesign of `titz.cooking` built with [EmDash CMS](https://github.com/emdash-cms/emdash) and Astro, deployed on Cloudflare Workers with D1 and R2.

## What's Included

- **Stage / Hero Section**: High-impact editorial design with dynamic corner marks and coordinates.
- **CMS-Driven Navigation**: Top navigation is dynamically mapped to the "Hauptmenü" (main) in EmDash.
- **Flexible Theme Settings**: Logo, CTA labels, and links are configurable via the "Theme Settings" singleton in the Admin UI.
- **Dynamic Content**: Signature Dishes, News & Press, Offers, and CV Stations are all managed via CMS collections.
- **404 Page**: Custom, design-aligned 404 page fully configurable via CMS.
- **Cloudflare Integration**: Built-in support for Cloudflare D1 (database), R2 (media), and Send Email (system notifications).

## Pages

| Page | Route |
|---|---|
| Homepage | `/` |
| CV Stationen | `/stationen` |
| News & Press | `/news` (linked via anchor or CMS) |
| Legal / Static Pages | `/:slug` (e.g., `/impressum`, `/datenschutz`) |
| Search | `/search` |
| 404 | `/404` (CMS-driven) |

## Infrastructure

- **Runtime:** Cloudflare Workers
- **Database:** D1 (titz-emdash-site)
- **Storage:** R2 (titz-emdash-media)
- **Framework:** Astro 5.x with `@astrojs/cloudflare`
- **Styling:** Tailwind CSS v4

## Local Development

```bash
npm install
npx emdash dev
```

## Deploying

```bash
npm run deploy
```

## CMS Admin

The admin UI is available at `https://emdash.titz.cooking/_emdash/admin`. 
- **Theme Settings**: Located under ADMIN -> Theme Settings.
- **Menus**: Located under MANAGE -> Menus -> Hauptmenü.

