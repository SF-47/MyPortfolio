import { useState } from 'react'
import type { FormEvent } from 'react'
import { profile, socialLinks } from '../data/portfolioData'

const contactLinks = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { label: 'GitHub', value: 'github.com/SF-47', href: 'https://github.com/SF-47', external: true },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/sami-farhat-46692641a',
    href: socialLinks.find((link) => link.label === 'LinkedIn')?.href,
    external: true,
  },
  { label: 'Portfolio', value: 'This website', href: '/' },
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
    <section className="section-shell bg-surface py-20 md:py-32" id="contact">
      <div className="grid gap-14 md:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] md:items-start md:gap-16 lg:gap-20">
        <div className="min-w-0">
          <span className="meta-num mb-4 block text-primary">[05] CONNECT</span>
          <h2 className="section-title mb-6">Start a Conversation.</h2>
          <p className="mb-8 max-w-xl text-body text-on-surface-variant">
            {profile.availability}
          </p>
          <div className="space-y-6">
            <ContactRow icon="mail" label="Email" value={profile.email} href={`mailto:${profile.email}`} />
            <ContactRow icon="location_on" label="Location" value={profile.location} />
            <div className="border-t border-outline-variant pt-6">
              <p className="label-caps mb-4 text-primary">Direct Links</p>
              <div className="grid gap-3">
                {contactLinks.map((link) =>
                  link.href ? (
                    <a
                      className="contact-link"
                      href={link.href}
                      key={link.label}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      <span>{link.label}</span>
                      <span>{link.value}</span>
                    </a>
                  ) : null,
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center border border-outline transition-colors">
                <span className="material-symbols-outlined">link</span>
              </span>
              <div>
                <p className="label-caps mb-1 text-on-surface-variant">Profiles</p>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((link) =>
                    link.href ? (
                      <a className="label-caps text-on-surface hover:text-primary" href={link.href} key={link.label} target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined}>
                        {link.label}
                      </a>
                    ) : (
                      <span className="label-caps text-on-surface-variant" key={link.label}>
                        {link.label} URL pending
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <form className="min-w-0 border border-outline-variant bg-surface-container-lowest p-6 md:p-10" onSubmit={handleSubmit} noValidate>
          <Field
            autoComplete="name"
            error={errors.name}
            id="name"
            label="Name"
            onChange={(value) => updateValue('name', value)}
            placeholder="Your Full Name"
            value={values.name}
          />
          <Field
            autoComplete="email"
            error={errors.email}
            id="email"
            label="Email"
            onChange={(value) => updateValue('email', value)}
            placeholder="email@example.com"
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
            <label className="label-caps mb-2 block text-on-surface-variant" htmlFor="message">Message</label>
            <textarea
              aria-describedby={errors.message ? 'message-error' : undefined}
              aria-invalid={Boolean(errors.message)}
              autoComplete="off"
              className="editorial-field min-h-32 resize-y"
              id="message"
              name="message"
              onChange={(event) => updateValue('message', event.target.value)}
              placeholder="Describe your project or opportunity..."
              rows={5}
              value={values.message}
            />
            {errors.message ? <p className="form-error" id="message-error">{errors.message}</p> : null}
          </div>

          <button className="w-full bg-primary-container py-4 label-caps uppercase tracking-[0.16em] text-white transition hover:brightness-110 active:scale-[0.99] disabled:cursor-wait disabled:opacity-75" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Preparing Email' : 'Open Email Draft'}
          </button>
          <p className="mt-4 text-sm leading-6 text-on-surface-variant" role="status" aria-live="polite">
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
  placeholder,
  type = 'text',
  value,
}: {
  autoComplete: string
  error?: string
  id: keyof FormValues
  label: string
  onChange: (value: string) => void
  placeholder: string
  type?: string
  value: string
}) {
  const errorId = `${id}-error`

  return (
    <div className="mb-8">
      <label className="label-caps mb-2 block text-on-surface-variant" htmlFor={id}>{label}</label>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        autoComplete={autoComplete}
        className="editorial-field"
        id={id}
        name={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {error ? <p className="form-error" id={errorId}>{error}</p> : null}
    </div>
  )
}

function ContactRow({ icon, label, value, href }: { icon: string; label: string; value: string; href?: string }) {
  const content = href ? (
    <a className="label-caps text-on-surface hover:text-primary" href={href}>{value}</a>
  ) : (
    <span className="label-caps text-on-surface">{value}</span>
  )

  return (
    <div className="flex items-center gap-4">
      <span className="flex h-12 w-12 items-center justify-center border border-outline transition-colors">
        <span className="material-symbols-outlined">{icon}</span>
      </span>
      <div>
        <p className="label-caps mb-1 text-on-surface-variant">{label}</p>
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
