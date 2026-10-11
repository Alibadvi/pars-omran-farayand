'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { documentCategoryLabels } from '@/lib/presentation'

export function ProjectDocumentUpload({ projectId }: { projectId: number | string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    const file = fields.get('file')
    if (!(file instanceof File) || !file.size) { setError('یک فایل برای بارگذاری انتخاب کنید.'); return }

    setBusy(true)
    setError('')
    setNotice('')
    try {
      const body = new FormData()
      body.set('file', file)
      body.set('_payload', JSON.stringify({
        project: projectId,
        title: String(fields.get('title') || '').trim(),
        category: String(fields.get('category') || ''),
      }))
      const response = await fetch('/api/project-documents', { method: 'POST', body })
      const result = await response.json().catch(() => null)
      if (!response.ok) {
        const detail = result?.errors?.[0]?.data?.errors?.[0]?.message
        throw new Error(response.status === 401 ? 'نشست شما پایان یافته است. دوباره وارد شوید.' : detail || result?.message || 'بارگذاری سند انجام نشد.')
      }
      form.reset()
      setNotice('سند با موفقیت در این پروژه ثبت شد.')
      router.refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'بارگذاری سند انجام نشد.')
    } finally { setBusy(false) }
  }

  return <details className="upload-box"><summary>بارگذاری سند جدید <span aria-hidden="true">＋</span></summary>
    <form className="compose" onSubmit={submit}>
      <label>عنوان سند<input name="title" required maxLength={180} placeholder="مثلاً نقشه اجرایی فاز اول" /></label>
      <label>دسته‌بندی<select name="category" required defaultValue=""><option value="" disabled>انتخاب دسته‌بندی</option>{Object.entries(documentCategoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>فایل<input name="file" type="file" required accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx" /><small>PDF، تصویر، Word یا Excel</small></label>
      <button className="button button-dark" disabled={busy} type="submit">{busy ? 'در حال بارگذاری…' : 'ثبت سند ←'}</button>
      {error && <p className="form-error" role="alert">{error}</p>}
      {notice && <p className="form-notice" role="status">{notice}</p>}
    </form>
  </details>
}
