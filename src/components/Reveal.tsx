import { useEffect, useRef } from 'react'
import type { ElementType, ReactNode } from 'react'

export function Reveal({
  as: Tag = 'div',
  children,
  className,
  delay = 0,
}: {
  as?: ElementType
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag className={className} data-reveal ref={ref} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}
