import { profile, socialLinks } from '../../data/portfolioData'
import { SeamRuler } from './SeamRuler'
import { textLinkClass } from '../ui/textLinkClass'
import { Surface } from './Surface'

// `seam` draws the ruler above the footer when the page's last section is dark canvas.
export function SiteFooter({ seam }: { seam: boolean }) {
  return (
    <Surface as="footer" className={seam ? '' : 'border-t border-rule'}>
      {seam ? <SeamRuler edge="top" /> : null}
      <div className="wrap flex flex-col gap-2 py-6 md:flex-row md:items-center md:justify-between md:gap-6">
        <p className="mono-label">© 2026 {profile.name} · Built in Beirut</p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-7">
            {socialLinks.map((link) =>
              link.href ? (
                <li key={link.label}>
                  <a className={textLinkClass} href={link.href} rel="noopener noreferrer" target="_blank">
                    {link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ) : null,
            )}
            <li>
              <a className={`${textLinkClass} min-w-11 justify-center`} href="#top">
                Top ↑
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </Surface>
  )
}
