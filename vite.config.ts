import { defineConfig, type Connect } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// Serve /findly from findly.html in dev and preview, like the Vercel rewrite does in production.
const findlyRoute: Connect.NextHandleFunction = (req, _res, next) => {
  if (req.url === '/findly' || req.url?.startsWith('/findly?')) req.url = req.url.replace('/findly', '/findly.html')
  next()
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'findly-route',
      configureServer: (server) => void server.middlewares.use(findlyRoute),
      configurePreviewServer: (server) => void server.middlewares.use(findlyRoute),
    },
  ],
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        findly: resolve(import.meta.dirname, 'findly.html'),
      },
    },
  },
})
