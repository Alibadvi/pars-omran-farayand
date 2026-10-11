'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'

export function ProjectActions({ projectId, mode, disabled = false }: { projectId: number | string; mode: 'internal' | 'external'; disabled?: boolean }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (mode !== 'internal') return
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') router.refresh()
    }, 20000)
    return () => clearInterval(interval)
  }, [mode, router])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    const body = String(fields.get('body') ?? '').trim()
    const subject = mode === 'internal' ? body.slice(0, 80) : fields.get('subject')
    setBusy(true)
    setError('')
    try {
      const response = await fetch(mode === 'internal' ? '/api/portal/messages' : '/api/portal/mail/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, subject, body, to: fields.get('to') }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'ارسال انجام نشد.')
      form.reset()
      router.refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'ارسال انجام نشد.')
    } finally { setBusy(false) }
  }

  if (disabled) return <p className="mail-disconnected">اتصال ایمیل Outlook هنوز توسط دفتر تهران انجام نشده است. ارسال ایمیل تا زمان اتصال فعال نمی‌شود.</p>

  return <form className="compose" onSubmit={submit}>
    {mode === 'external' && <label>گیرنده بیرونی<input autoComplete="email" name="to" type="email" required placeholder="name@example.com" /></label>}
    {mode === 'external' && <label>موضوع<input name="subject" required maxLength={180} placeholder="موضوع ایمیل" /></label>}
    <label>متن<textarea name="body" required maxLength={20000} rows={4} placeholder="پیام خود را بنویسید…" /></label>
    <button disabled={busy} type="submit">{busy ? 'در حال ارسال…' : mode === 'external' ? 'ارسال ایمیل' : 'ثبت پیام داخلی'}</button>
    {error && <p className="form-error" role="alert">{error}</p>}
  </form>
}
