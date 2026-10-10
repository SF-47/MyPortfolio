import { useState } from 'react'
import type { FormEvent } from 'react'
import { profile, socialLinks } from '../data/portfolioData'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

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

  return (
    <section className="page py-20 md:py-32" id="contact">
      <SectionHead num="05" title="Contact" aside={profile.location} />
      <div className="grid gap-16 md:grid-cols-12 md:gap-12">
        <Reveal className="min-w-0 md:col-span-6">
          <h3 className="display text-[44px] md:text-[72px]">
            Start a <em className="text-accent">conversation.</em>
          </h3>
          <p className="lede mt-8 text-ink-soft">{profile.availability}</p>
          <a
            className="mt-10 block break-words border-b border-ink pb-3 font-display text-[28px] leading-tight transition-colors hover:border-accent hover:text-accent md:text-[40px]"
            href={`mailto:${profile.email}`}
          >
            {profile.email}
          </a>
          <div className="mt-10 border-t border-ink">
            {contactLinks.map((link) =>
              link.href ? (
                <a
                  className="row-hover grid grid-cols-[96px_1fr] gap-4 border-b border-rule py-3"
                  href={link.href}
                  key={link.label}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                >
                  <span className="mono text-ink-soft">{link.label}</span>
                  <span className="min-w-0 break-words text-[15px]">{link.value}</span>
                </a>
              ) : null,
            )}
          </div>
        </Reveal>

        <Reveal className="min-w-0 md:col-span-6" delay={120}>
          <form className="border border-ink bg-paper-deep p-6 md:p-10" onSubmit={handleSubmit} noValidate>
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
              <label className="mono mb-1 block text-ink-soft" htmlFor="message">Message</label>
              <textarea
                aria-describedby={errors.message ? 'message-error' : undefined}
                aria-invalid={Boolean(errors.message)}
                autoComplete="off"
                className="field min-h-32 resize-y"
                id="message"
                name="message"
                onChange={(event) => updateValue('message', event.target.value)}
                placeholder="Describe your project or opportunity…"
                rows={5}
                value={values.message}
              />
              {errors.message ? <p className="form-error" id="message-error">{errors.message}</p> : null}
            </div>

            <button className="btn btn-solid w-full disabled:cursor-wait disabled:opacity-75" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Preparing email' : 'Open email draft →'}
            </button>
            <p className="mt-4 text-sm leading-6 text-ink-soft" role="status" aria-live="polite">
              {status === 'mailto'
                ? 'A prepared email draft was requested. If your email app did not open, use the direct email link on this page.'
                : 'No backend email service is configured, so this form uses a mailto fallback.'}
            </p>
            {status === 'error' ? (
              <p className="form-error" role="alert">Please fix the highlighted fields before sending.</p>
            ) : null}
          </form>
        </Reveal>
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
      <label className="mono mb-1 block text-ink-soft" htmlFor={id}>{label}</label>
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
