import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { profile } from '../../data/portfolioData'

type Values = { name: string; email: string; subject: string; message: string }
type Errors = Partial<Record<keyof Values, string>>

const initialValues: Values = { name: '', email: '', subject: '', message: '' }

function validate(values: Values): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = 'Enter your name.'
  if (!values.email.trim()) errors.email = 'Enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address.'
  if (!values.subject.trim()) errors.subject = 'Enter a subject.'
  if (!values.message.trim()) errors.message = 'Enter a message.'
  return errors
}

const fieldClass =
  'mt-1 block min-h-11 w-full border-0 border-b bg-transparent py-2.5 text-[17px] text-fg placeholder:text-canvas-line'

// The contact form. There is no mail service behind it: a valid submission opens a draft in
// the visitor's email app through a mailto: link, and the page says so.
export function ContactForm() {
  const [values, setValues] = useState<Values>(initialValues)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'drafted' | 'error'>('idle')
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const update = (field: keyof Values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setStatus('idle')
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    const firstInvalid = (Object.keys(found) as Array<keyof Values>)[0]
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus()
      setStatus('error')
      return
    }
    setStatus('submitting')
    const body = [`Name: ${values.name}`, `Email: ${values.email}`, '', values.message].join('\n')
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`
    timer.current = window.setTimeout(() => setStatus('drafted'), 700)
  }

  const fields: Array<{ id: keyof Values; label: string; placeholder: string; autoComplete: string; type?: string; multiline?: boolean }> = [
    { id: 'name', label: 'Name', placeholder: 'Your full name', autoComplete: 'name' },
    { id: 'email', label: 'Email', placeholder: 'email@example.com', autoComplete: 'email', type: 'email' },
    { id: 'subject', label: 'Subject', placeholder: 'Opportunity, project, or question', autoComplete: 'off' },
    { id: 'message', label: 'Message', placeholder: 'Describe your project or opportunity…', autoComplete: 'off', multiline: true },
  ]
  const submitting = status === 'submitting'

  return (
    <form aria-label="Contact form" noValidate onSubmit={submit}>
      <p className="mono-label text-fg-muted">Or write here</p>
      {fields.map((field) => {
        const error = errors[field.id]
        const inputId = `contact-${field.id}`
        const common = {
          'aria-describedby': error ? `${inputId}-error` : undefined,
          'aria-invalid': Boolean(error),
          autoComplete: field.autoComplete,
          className: `${fieldClass} ${error ? 'border-signal' : 'border-canvas-line'}`,
          id: inputId,
          name: field.id,
          onChange: (event: { target: { value: string } }) => update(field.id, event.target.value),
          placeholder: field.placeholder,
          value: values[field.id],
        }
        return (
          <div className="mt-6" key={field.id}>
            <label className="mono-label text-fg-muted" htmlFor={inputId}>
              {field.label}
            </label>
            {field.multiline ? (
              <textarea {...common} className={`${common.className} min-h-[120px] resize-y`} rows={5} />
            ) : (
              <input {...common} inputMode={field.type === 'email' ? 'email' : undefined} spellCheck={field.type === 'email' ? false : undefined} type={field.type ?? 'text'} />
            )}
            {error ? (
              <p className="mt-1.5 text-[15px] text-signal" id={`${inputId}-error`}>
                {error}
              </p>
            ) : null}
          </div>
        )
      })}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          className="inline-flex h-[54px] items-center bg-signal px-6 text-[16px] font-medium text-canvas aria-disabled:cursor-wait aria-disabled:opacity-70"
          aria-disabled={submitting}
          onClick={(event) => {
            if (submitting) event.preventDefault()
          }}
          type="submit"
        >
          {submitting ? 'Preparing email…' : 'Send message →'}
        </button>
        <span className="mono-label text-fg-muted">Opens your email app</span>
      </div>
      <p aria-live="polite" className="mt-4 max-w-[460px] text-[15px] text-fg-muted" role="status">
        {status === 'submitting'
          ? 'Preparing your email draft…'
          : status === 'drafted'
            ? `A draft was requested. If your email app did not open, write to ${profile.email}.`
            : 'No mail service sits behind this form. It opens a draft in your email app; nothing is sent from this page.'}
      </p>
      {status === 'error' ? (
        <p className="mt-3 text-signal" role="alert">
          Please fix the highlighted fields before sending.
        </p>
      ) : null}
    </form>
  )
}
