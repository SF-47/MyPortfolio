import { useEffect } from 'react'
import pageMeta from './pageMeta.json'

export const { siteUrl, routes } = pageMeta
export type RouteKey = keyof typeof routes

type TagKey = { attr: 'name' | 'property' | 'rel'; value: string }

// The static tags in index.html (and the per-route copies written at build time by
// scripts/prerender-routes.mjs) are the source for crawlers. This hook keeps the same
// tags in sync during client-side navigation by updating them in place, so no
// duplicate <title> or <meta> elements are ever created.
function setTag(tag: 'meta' | 'link', key: TagKey, value: string | null) {
  const selector = `${tag}[${key.attr}="${key.value}"]`
  let element = document.head.querySelector<HTMLElement>(selector)
  if (value === null) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement(tag)
    element.setAttribute(key.attr, key.value)
    document.head.appendChild(element)
  }
  element.setAttribute(tag === 'link' ? 'href' : 'content', value)
}

export function usePageMeta(key: RouteKey) {
  useEffect(() => {
    const route = routes[key]
    const noindex = 'noindex' in route && route.noindex
    const url = noindex ? null : `${siteUrl}${route.path === '/' ? '' : route.path}`

    document.title = route.title
    setTag('meta', { attr: 'name', value: 'description' }, route.description)
    setTag('meta', { attr: 'name', value: 'robots' }, noindex ? 'noindex' : null)
    setTag('link', { attr: 'rel', value: 'canonical' }, url)
    setTag('meta', { attr: 'property', value: 'og:title' }, route.title)
    setTag('meta', { attr: 'property', value: 'og:description' }, route.description)
    setTag('meta', { attr: 'property', value: 'og:url' }, url)
    setTag('meta', { attr: 'name', value: 'twitter:title' }, route.title)
    setTag('meta', { attr: 'name', value: 'twitter:description' }, route.description)
  }, [key])
}
