import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRef } from 'react'
import { profile, socialLinks } from '../data/portfolioData'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Magnetic } from './ui/Magnetic'
import { SectionHead } from './ui/SectionHead'

const linkedInHref = socialLinks.find((link) => link.label === 'LinkedIn')?.href

const contactLinks = [
  { label: 'GitHub', value: 'github.com/SF-47', href: 'https://github.com/SF-47', external: true },
  {
    label: 'LinkedIn',
    value: linkedInHref?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
    href: linkedInHref,
    external: true,
  },
]

type FormValues = {
  name: string
  email: string
  subject: string
  message: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const initialValues: FormValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

export function Contact() {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'mailto' | 'error'>('idle')

  const updateValue = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setStatus('idle')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateForm(values)
    setErrors(nextErrors)

    const firstInvalid = Object.keys(nextErrors)[0]
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus()
    }

    if (Object.keys(nextErrors).length > 0) {
      setStatus('error')
      return
    }

    setStatus('submitting')

    const body = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      '',
      values.message,
    ].join('\n')
    const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`

    window.location.href = mailto
    setStatus('mailto')
  }

  const isSubmitting = status === 'submitting'

  const root = useRef<HTMLElement>(null)
  useScrollReveal(root)

  return (
    <section className="shell py-28 md:py-40" id="contact" ref={root}>
      <SectionHead
        index="05"
        label="Connect"
        title={
          <>
            Let&rsquo;s build something <span className="serif text-grad">worth shipping.</span>
          </>
        }
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <div className="min-w-0" data-reveal>
          <p className="mb-10 max-w-xl text-lg leading-8 text-mute">{profile.availability}</p>
          <div className="grid gap-4">
            <ContactRow icon="mail" label="Email" value={profile.email} href={`mailto:${profile.email}`} />
            <ContactRow icon="pin" label="Location" value={profile.location} />
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {contactLinks.map((link) =>
              link.href ? (
                <Magnetic key={link.label}>
                  <a
                    className="btn"
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                  >
                    {link.label} <span aria-hidden="true">↗</span>
                  </a>
                </Magnetic>
              ) : null,
            )}
          </div>
        </div>

        <form className="glass min-w-0 p-6 md:p-10" data-spot data-reveal data-delay="0.1" onSubmit={handleSubmit} noValidate>
          <Field
            autoComplete="name"
            error={errors.name}
            id="name"
            label="Name"
            onChange={(value) => updateValue('name', value)}
            placeholder="Your full name"
            value={values.name}
          />
          <Field
            autoComplete="email"
            error={errors.email}
            id="email"
            label="Email"
            onChange={(value) => updateValue('email', value)}
            placeholder="email@example.com"
            inputMode="email"
            spellCheck={false}
            type="email"
            value={values.email}
          />
          <Field
            autoComplete="off"
            error={errors.subject}
            id="subject"
            label="Subject"
            onChange={(value) => updateValue('subject', value)}
            placeholder="Opportunity, project, or question"
            value={values.subject}
          />
          <div className="mb-8">
            <label className="mono mb-2 block text-mute" htmlFor="message">Message</label>
            <textarea
              aria-describedby={errors.message ? 'message-error' : undefined}
              aria-invalid={Boolean(errors.message)}
              autoComplete="off"
              className="field min-h-36 resize-y"
              id="message"
              name="message"
              onChange={(event) => updateValue('message', event.target.value)}
              placeholder="Describe your project or opportunity…"
              rows={5}
              value={values.message}
            />
            {errors.message ? <p className="form-error" id="message-error">{errors.message}</p> : null}
          </div>

          <button className="btn btn-primary w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Preparing email…' : 'Open email draft'}
          </button>
          <p className="mt-4 text-sm leading-6 text-mute" role="status" aria-live="polite">
            {status === 'mailto'
              ? 'A prepared email draft was requested. If your email app did not open, use the direct email link on this page.'
              : 'No backend email service is configured, so this form uses a mailto fallback.'}
          </p>
          {status === 'error' ? (
            <p className="form-error" role="alert">Please fix the highlighted fields before sending.</p>
          ) : null}
        </form>
      </div>
    </section>
  )
}

function Field({
  autoComplete,
  error,
  id,
  label,
  onChange,
  inputMode,
  placeholder,
  spellCheck,
  type = 'text',
  value,
}: {
  autoComplete: string
  error?: string
  id: keyof FormValues
  label: string
  onChange: (value: string) => void
  inputMode?: 'email'
  placeholder: string
  spellCheck?: boolean
  type?: string
  value: string
}) {
  const errorId = `${id}-error`

  return (
    <div className="mb-8">
      <label className="mono mb-2 block text-mute" htmlFor={id}>{label}</label>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        autoComplete={autoComplete}
        className="field"
        id={id}
        inputMode={inputMode}
        name={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={spellCheck}
        type={type}
        value={value}
      />
      {error ? <p className="form-error" id={errorId}>{error}</p> : null}
    </div>
  )
}

function ContactRow({ icon, label, value, href }: { icon: 'mail' | 'pin'; label: string; value: string; href?: string }) {
  const content = href ? (
    <a className="break-all text-lg transition-colors hover:text-cyan" href={href}>{value}</a>
  ) : (
    <span className="text-lg">{value}</span>
  )

  return (
    <div className="glass flex items-center gap-5 !rounded-2xl p-4" data-spot>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-cyan">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {icon === 'mail' ? (
            <>
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="m4 7 8 6 8-6" />
            </>
          ) : (
            <>
              <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </>
          )}
        </svg>
      </span>
      <div className="min-w-0">
        <p className="mono mb-1 text-mute">{label}</p>
        {content}
      </div>
    </div>
  )
}

function validateForm(values: FormValues) {
  const nextErrors: FormErrors = {}

  if (!values.name.trim()) {
    nextErrors.name = 'Enter your name.'
  }

  if (!values.email.trim()) {
    nextErrors.email = 'Enter your email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    nextErrors.email = 'Enter a valid email address.'
  }

  if (!values.subject.trim()) {
    nextErrors.subject = 'Enter a subject.'
  }

  if (!values.message.trim()) {
    nextErrors.message = 'Enter a message.'
  }

  return nextErrors
}
