// Runs after `vite build`. Writes one HTML shell per route into dist/ with that route's
// own <title>, description, canonical URL and Open Graph / Twitter tags, plus a real
// dist/404.html. Static hosts (Vercel) then serve /work/findly directly on a deep link or
// refresh, answer unknown URLs with a genuine 404 status, and link-preview crawlers (which
// do not run JavaScript) see correct metadata. The React app boots from the same bundle.
//
// Also writes robots.txt and sitemap.xml from the same data, so the site's address lives in
// one place (siteUrl in src/app/pageMeta.json).
//
// Route data comes from src/app/pageMeta.json, which the router also reads.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const meta = JSON.parse(await readFile(path.join(root, 'src/app/pageMeta.json'), 'utf8'))
const template = await readFile(path.join(dist, 'index.html'), 'utf8')

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escapeText = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const managedMeta = ['description', 'robots', 'og:title', 'og:description', 'og:url', 'og:image', 'twitter:title', 'twitter:description', 'twitter:image']
const managedPattern = new RegExp(`<meta\\s+(?:name|property)="(?:${managedMeta.join('|')})"[^>]*>\\s*`, 'g')

function render(route) {
  const noindex = route.noindex === true
  const url = `${meta.siteUrl}${route.path === '/' ? '' : route.path}`
  const image = `${meta.siteUrl}${meta.defaultImage}`
  const tags = [
    `<title>${escapeText(route.title)}</title>`,
    `<meta name="description" content="${escapeAttr(route.description)}" />`,
    noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${escapeAttr(url)}" />`,
    `<meta property="og:title" content="${escapeAttr(route.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(route.description)}" />`,
    ...(noindex ? [] : [`<meta property="og:url" content="${escapeAttr(url)}" />`]),
    `<meta property="og:image" content="${escapeAttr(image)}" />`,
    `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(image)}" />`,
  ]
  const html = template
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(managedPattern, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/, '')
    .replace('</head>', `    ${tags.join('\n    ')}\n  </head>`)
  if (!html.includes(`<title>${escapeText(route.title)}</title>`)) throw new Error(`Could not write metadata for ${route.path}`)
  return html
}

function outputFile(key, route) {
  if (key === 'notFound') return path.join(dist, '404.html')
  if (route.path === '/') return path.join(dist, 'index.html')
  return path.join(dist, route.path, 'index.html')
}

const written = []
for (const [key, route] of Object.entries(meta.routes)) {
  const file = outputFile(key, route)
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, render(route))
  written.push(path.relative(root, file))
}
const indexable = Object.values(meta.routes).filter((route) => route.noindex !== true)
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${meta.siteUrl}/sitemap.xml\n`)
await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable
    .map((route) => `  <url><loc>${escapeText(meta.siteUrl + (route.path === '/' ? '/' : route.path))}</loc></url>`)
    .join('\n')}\n</urlset>\n`,
)
written.push('robots.txt', 'sitemap.xml')
console.log(`prerender-routes: wrote ${written.join(', ')}`)
