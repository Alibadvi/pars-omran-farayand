import { NextRequest, NextResponse } from 'next/server'
import type { PayloadRequest } from 'payload'
import { hasPortalOrigin } from '@/lib/origin'

import { authenticatedSession, canAccessProject } from '@/lib/session'

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

  await session.payload.create({
    collection: 'project-messages', overrideAccess: true,
    req: { user: { ...session.user, collection: 'users' } as PayloadRequest['user'] },
    data: { project: id, subject, body, author: session.user.id },
  })
  return NextResponse.json({ ok: true })
}
