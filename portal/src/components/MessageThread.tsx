'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import type { RecipientOption } from './ProjectActions'

type Message = { id: number | string; authorId: number | string; authorName: string; recipientId: number | string | null; recipientName: string; subject: string; body: string; createdAt: string; createdISO: string; editedAt?: string | null }

export function MessageThread({ messages, recipients, viewerId, isAdmin }: { messages: Message[]; recipients: RecipientOption[]; viewerId: number | string; isAdmin: boolean }) {
  const router = useRouter()
  const [editing, setEditing] = useState<number | string | null>(null)
  const [busy, setBusy] = useState<number | string | null>(null)
  const [error, setError] = useState('')

  async function save(event: FormEvent<HTMLFormElement>, id: number | string) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setBusy(id); setError('')
    try {
      const response = await fetch('/api/portal/messages', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, body: data.get('body'), recipientId: data.get('recipient') || null }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'ویرایش انجام نشد.')
      setEditing(null); router.refresh()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'ویرایش انجام نشد.') }
    finally { setBusy(null) }
  }

  async function remove(id: number | string) {
    if (!window.confirm('این پیام برای همیشه حذف شود؟')) return
    setBusy(id); setError('')
    try {
      const response = await fetch('/api/portal/messages', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'حذف انجام نشد.')
      router.refresh()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'حذف انجام نشد.') }
    finally { setBusy(null) }
  }

  return <div className="item-list message-list">
    {error && <p className="form-error" role="alert">{error}</p>}
    {messages.map((message) => <article className={`message-item${String(viewerId) === String(message.authorId) ? ' message-item-mine' : ''}`} key={message.id}>
      <div className="message-meta"><span className="avatar" aria-hidden="true">{message.authorName.slice(0, 1)}</span><div className="message-address"><div className="message-participants"><span>از <strong>{message.authorName}</strong></span><span>به <strong>{message.recipientName}</strong></span></div><time dateTime={message.createdISO}>{message.createdAt}{message.editedAt ? ` · ویرایش‌شده ${message.editedAt}` : ''}</time></div></div>
      {editing === message.id ? <form className="compose message-edit" onSubmit={(event) => save(event, message.id)}>
        <label>گیرنده<select name="recipient" defaultValue={String(message.recipientId || '')}><option value="">همه اعضای پروژه</option>{recipients.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.role.startsWith('hq-') ? 'دفتر تهران' : 'سایت پروژه'}</option>)}</select></label>
        <label>متن پیام<textarea name="body" required maxLength={20000} defaultValue={message.body} rows={4} /></label>
        <div className="message-tools"><button type="submit" disabled={busy === message.id}>ذخیره</button><button type="button" disabled={busy === message.id} onClick={() => setEditing(null)}>انصراف</button></div>
      </form> : <><p>{message.body}</p>{(isAdmin || String(viewerId) === String(message.authorId)) && <div className="message-tools"><button type="button" disabled={busy === message.id} onClick={() => { setError(''); setEditing(message.id) }}>ویرایش</button><button type="button" disabled={busy === message.id} onClick={() => remove(message.id)}>حذف</button></div>}</>}
    </article>)}
    {!messages.length && <p className="muted empty-inline">هنوز پیامی ثبت نشده است. گفتگو را با یک پیام شروع کنید.</p>}
  </div>
}
