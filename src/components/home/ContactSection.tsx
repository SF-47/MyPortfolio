import { profile, socialLinks } from '../../data/portfolioData'
import { Surface } from '../layout/Surface'
import { ContactForm } from './ContactForm'

const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
const rowClass = 'grid grid-cols-[96px_1fr_auto] items-center border-t border-rule py-3.5 font-medium last:border-b md:grid-cols-[120px_1fr_auto]'

// "Start a conversation": the email address is the main element; the form is the alternative.
export function ContactSection() {
  return (
    <Surface aria-labelledby="contact-heading" as="section" className="section-y" id="contact" tone="canvas">
      <div className="wrap grid gap-14 lg:grid-cols-[6fr_5fr] xl:gap-24">
        <div>
          <p className="mono-label eyebrow text-signal">05 — Connect</p>
          <h2 className="mt-6 font-serif text-[24px] font-light leading-[1.1] tracking-[-0.02em] md:text-[40px] xl:text-[44px]" id="contact-heading">
            Start a conversation.
          </h2>
          <a
            className="mt-7 block w-max max-w-full break-words border-b border-signal pb-2 font-serif text-[27px] font-light leading-[1.1] tracking-[-0.025em] md:mt-9 md:text-[42px] xl:text-[52px]"
            href={`mailto:${profile.email}`}
          >
            {profile.email}
          </a>
          <p className="mb-9 mt-[18px] max-w-[520px] text-fg-muted">{profile.availability}</p>
          <ul>
            <li className={rowClass}>
              <span className="mono-label text-fg-muted">Location</span>
              <span>{profile.location}</span>
            </li>
            {socialLinks.map((link) =>
              link.href ? (
                <li key={link.label}>
                  <a className={`${rowClass} border-b-0`} href={link.href} rel="noopener noreferrer" target="_blank">
                    <span className="mono-label text-fg-muted">{link.label}</span>
                    <span>{bare(link.href)}</span>
                    <span aria-hidden="true" className="hidden md:inline">
                      ↗
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ) : null,
            )}
            <li>
              <a className={rowClass} download href="/cv.pdf">
                <span className="mono-label text-fg-muted">CV</span>
                <span>Download PDF</span>
                <span aria-hidden="true" className="hidden md:inline">
                  ↓
                </span>
              </a>
            </li>
          </ul>
        </div>
        <ContactForm />
      </div>
    </Surface>
  )
}
