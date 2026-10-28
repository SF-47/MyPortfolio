# Sami Farhat - Portfolio

Personal portfolio: a single-page home and a Findly case study. React 19, TypeScript, Vite,
Tailwind CSS 4 and React Router (data router). No other runtime dependencies.

## Scripts

- `npm run dev` - start the dev server
- `npm run build` - typecheck, build to `dist/`, then write the per-route HTML, `robots.txt` and `sitemap.xml`
- `npm run lint` - run ESLint
- `npm run preview` - preview the production build

## Where things live

- `src/data/portfolioData.ts` - verified profile, project, experience and skills content
- `src/data/findly/` - Findly case study data: architecture, request trace, decisions, matching filter and the illustrative simulation sample
- `src/styles/tokens.css` - design tokens (paper and canvas surfaces, one signal colour); `fonts.css` - self-hosted fonts
- `src/app/pageMeta.json` - per-route title, description and `siteUrl`, the one place the site's address is set

## Routing and SEO

The app is client-rendered, but `scripts/prerender-routes.mjs` runs after the build and writes
`dist/index.html`, `dist/work/findly/index.html` and a real `dist/404.html`, each with that
route's own title, description, canonical URL and Open Graph tags, plus `robots.txt` and
`sitemap.xml`, all from `pageMeta.json`. Crawlers and link previews therefore see correct
metadata without running JavaScript. `vercel.json` sets `trailingSlash: false` and long cache
headers for hashed bundles and fonts.

When the production address changes (for example a custom domain), change `siteUrl` in
`src/app/pageMeta.json` and rebuild.

## Fonts and images

Newsreader, Schibsted Grotesk and Martian Mono are self-hosted from `public/fonts` (see the
README there) and not preloaded on purpose (see `src/styles/fonts.css`). Project screenshots have an 800px copy for phones.
The social preview image is `public/og-image.png` (1200x630).
