# Sami Farhat · Portfolio

Personal portfolio, live at **https://sami-farhat.vercel.app**. A single page built with React 19,
TypeScript, Vite and Tailwind CSS 4, deployed on Vercel.

## Scripts

- `npm run dev` starts the dev server
- `npm run build` refreshes the GitHub activity snapshot, type-checks and builds to `dist/`
- `npm run lint` runs ESLint
- `npm run preview` serves the production build locally

## Where things live

- `src/data/` holds the content: `profile.ts` (name, status, links), `projects.ts`, `skills.ts`,
  `tech.ts` (logos and brand colours) and `github.json` (contribution snapshot)
- `src/components/` holds the sections: hero (badge, lamp, nav), about, projects, skills, contact, footer
- `src/components/background/SignalParticles.tsx` is the animated dot background
- `src/index.css` holds the theme tokens for dark and light mode, plus animations
- `public/` holds images, fonts, icons, the CV, `robots.txt` and `sitemap.xml`

## Configuration

- `VITE_WEB3FORMS_KEY`: the Web3Forms access key for the contact form. Set it in `.env.local`
  for local development and in Vercel → Settings → Environment Variables (Production and Preview).
  See `.env.example`.
- `scripts/fetch-github.mjs` runs before every build and updates `src/data/github.json`. If GitHub
  can't be reached, the last snapshot is kept.

## Deploying

Vercel builds `main` to production and every other branch to a preview URL.

## Credits

The background is the Signal Particles effect from ThreeUI. Technology logos come from Devicon
(MIT) and Simple Icons (CC0).
