import { NextRequest, NextResponse } from 'next/server'
import type { PayloadRequest } from 'payload'
import { hasPortalOrigin } from '@/lib/origin'

import { authenticatedSession, canAccessProject } from '@/lib/session'
import { referenceID } from '@/lib/access'

export async function POST(request: NextRequest) {
  if (!hasPortalOrigin(request)) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  const session = await authenticatedSession(request.headers)
  if (!session) return NextResponse.json({ error: 'ورود به حساب لازم است.' }, { status: 401 })

  const input = await request.json().catch(() => null)
  const id = Number(input?.projectId)
  const subject = String(input?.subject ?? '').trim()
  const body = String(input?.body ?? '').trim()
  if (!Number.isSafeInteger(id) || id < 1 || !canAccessProject(session.identity, id) || !subject || subject.length > 180 || !body || body.length > 20000) {
    return NextResponse.json({ error: 'اطلاعات پیام یا دسترسی به پروژه نامعتبر است.' }, { status: 400 })
  }

  try {
    await session.payload.create({
      collection: 'project-messages', overrideAccess: true,
      req: { user: { ...session.user, collection: 'users' } as PayloadRequest['user'] },
      data: { project: id, subject, body, author: session.user.id, recipient: input?.recipientId || null },
    })
  } catch { return NextResponse.json({ error: 'گیرنده باید از اعضای همین پروژه باشد.' }, { status: 400 }) }
  return NextResponse.json({ ok: true })
}

async function messageForChange(request: NextRequest) {
  if (!hasPortalOrigin(request)) return { error: NextResponse.json({ error: 'Invalid origin' }, { status: 403 }) }
  const session = await authenticatedSession(request.headers)
  if (!session) return { error: NextResponse.json({ error: 'ورود به حساب لازم است.' }, { status: 401 }) }
  const input = await request.json().catch(() => null)
  const id = Number(input?.id)
  if (!Number.isSafeInteger(id) || id < 1) return { error: NextResponse.json({ error: 'شناسه پیام نامعتبر است.' }, { status: 400 }) }
  const message = await session.payload.findByID({ collection: 'project-messages', id, depth: 0, overrideAccess: true }).catch(() => null)
  if (!message || !canAccessProject(session.identity, referenceID(message.project) || 0) ||
      (session.identity.role !== 'hq-admin' && String(referenceID(message.author)) !== String(session.user.id))) {
    return { error: NextResponse.json({ error: 'اجازه تغییر این پیام را ندارید.' }, { status: 403 }) }
  }
  return { session, message, input, id }
}

export async function PATCH(request: NextRequest) {
  const context = await messageForChange(request)
  if (context.error) return context.error
  const { session, input, id } = context
  const body = String(input?.body ?? '').trim()
  if (!body || body.length > 20000) return NextResponse.json({ error: 'متن پیام نامعتبر است.' }, { status: 400 })
  try {
    await session!.payload.update({
      collection: 'project-messages', id: id!, overrideAccess: false,
      req: { user: { ...session!.user, collection: 'users' } as PayloadRequest['user'] },
      data: { body, subject: body.slice(0, 80), recipient: input?.recipientId || null },
    })
  } catch { return NextResponse.json({ error: 'ویرایش انجام نشد. گیرنده و دسترسی خود را بررسی کنید.' }, { status: 400 }) }
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  const context = await messageForChange(request)
  if (context.error) return context.error
  const { session, id } = context
  await session!.payload.delete({ collection: 'project-messages', id: id!, overrideAccess: false,
    req: { user: { ...session!.user, collection: 'users' } as PayloadRequest['user'] } })
  return NextResponse.json({ ok: true })
}
