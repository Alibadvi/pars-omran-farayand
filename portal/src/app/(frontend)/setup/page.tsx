'use client'

import { useState, type FormEvent } from 'react'

export default function SetupPage() {
  const [error, setError] = useState('')
  const [complete, setComplete] = useState(false)
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    setError('')
    setBusy(true)
    try {
      const response = await fetch('/api/portal/bootstrap', {
        method: 'POST', headers: {
          'Content-Type': 'application/json',
          'x-portal-bootstrap-token': String(fields.get('setupToken') ?? ''),
        },
        body: JSON.stringify({
          email: fields.get('email'), name: fields.get('name'), password: fields.get('password'),
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Setup failed.')
      form.reset()
      setComplete(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Setup failed.')
    } finally { setBusy(false) }
  }

  return <main className="container setup-page" dir="rtl">
    <section className="panel">
      <p className="eyebrow">راه‌اندازی اولیه</p>
      <h1>مدیر دفتر تهران</h1>
      {complete ? <p>حساب مدیر ساخته شد. کلید راه‌اندازی را از تنظیمات سرور حذف کنید و سپس از مسیر <a href="/admin/login">ورود به پنل</a> وارد شوید.</p> :
        <form className="compose" onSubmit={submit}>
          <label>نام<input name="name" required maxLength={120} /></label>
          <label>ایمیل<input name="email" type="email" autoComplete="email" required /></label>
          <label>رمز عبور مدیر<input name="password" type="password" autoComplete="new-password" minLength={16} required /></label>
          <label>کلید یک‌بارمصرف راه‌اندازی<input name="setupToken" type="password" autoComplete="off" required /></label>
          <button type="submit" disabled={busy}>{busy ? 'در حال ساخت…' : 'ایجاد حساب مدیر'}</button>
          {error && <p className="form-error" role="alert">{error}</p>}
        </form>}
    </section>
  </main>
}
