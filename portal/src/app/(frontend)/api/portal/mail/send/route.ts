import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

import { accessToken, graphRequest, MAILBOX } from '@/lib/mail'
import { authenticatedSession, canAccessProject } from '@/lib/session'

export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  const session = await authenticatedSession(request.headers)
  if (!session) return NextResponse.json({ error: 'ورود به حساب لازم است.' }, { status: 401 })

  const input = await request.json().catch(() => null)
  const id = Number(input?.projectId)
  const to = String(input?.to ?? '').trim().toLowerCase()
  const subject = String(input?.subject ?? '').trim()
  const body = String(input?.body ?? '').trim()
  if (!Number.isSafeInteger(id) || id < 1 || !canAccessProject(session.identity, id) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) || to.length > 254 ||
      !subject || subject.length > 180 || !body || body.length > 20000) {
    return NextResponse.json({ error: 'گیرنده، متن یا دسترسی پروژه نامعتبر است.' }, { status: 400 })
  }

  // Do not create a misleading email history entry if the shared mailbox is disconnected.
  let token: string
  try { token = await accessToken(session.payload) }
  catch { return NextResponse.json({ error: 'ایمیل Outlook هنوز متصل نیست. از مدیر دفتر تهران بخواهید آن را وصل کند.' }, { status: 503 }) }

  const email = await session.payload.create({
    collection: 'external-emails', overrideAccess: true,
    data: { project: id, direction: 'outbound', subject, body, from: MAILBOX, to,
      sentBy: session.user.id, status: 'pending', clientRequestId: randomUUID(), occurredAt: new Date().toISOString() },
  })

  let submitted = false
  try {
    const draft = await graphRequest(token, '/v1.0/me/messages', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject, body: { contentType: 'Text', content: body },
        toRecipients: [{ emailAddress: { address: to } }],
        internetMessageHeaders: [{ name: 'x-pars-project-id', value: String(id) }],
      }),
    }) as { id?: string; conversationId?: string }
    if (!draft?.id || !draft?.conversationId) throw new Error('Outlook did not return a trackable draft.')
    await session.payload.update({ collection: 'external-emails', id: email.id, overrideAccess: true,
      data: { graphMessageId: draft.id, conversationId: draft.conversationId } })

    await graphRequest(token, `/v1.0/me/messages/${encodeURIComponent(draft.id)}/send`, { method: 'POST' })
    submitted = true
    await session.payload.update({ collection: 'external-emails', id: email.id, overrideAccess: true, data: { status: 'accepted' } })
    return NextResponse.json({ ok: true, status: 'accepted' })
  } catch (error) {
    if (submitted) {
      // Outlook accepted the send, but updating the local status failed. Never invite a blind retry.
      console.error('Outlook accepted a message; local status update failed:', email.id, error)
      return NextResponse.json({ ok: true, status: 'pending', warning: 'وضعیت نهایی نامشخص است؛ دوباره ارسال نکنید.' }, { status: 202 })
    }
    await session.payload.update({ collection: 'external-emails', id: email.id, overrideAccess: true, data: { status: 'failed' } }).catch(console.error)
    console.error('Outlook email submission failed:', email.id, error)
    return NextResponse.json({ error: 'ارسال ایمیل انجام نشد. وضعیت را در تاریخچه بررسی کنید.' }, { status: 502 })
  }
}
