import { timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { hasPortalOrigin } from '@/lib/origin'

/** One-time setup for packaged hosting, disabled after the first account exists. */
export async function POST(request: NextRequest) {
  const expected = process.env.PORTAL_BOOTSTRAP_TOKEN
  const provided = request.headers.get('x-portal-bootstrap-token')
  if (!expected || !/^[0-9a-f]{64}$/i.test(expected) || !provided ||
    provided.length !== expected.length ||
    !timingSafeEqual(Buffer.from(provided), Buffer.from(expected))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (!hasPortalOrigin(request)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  }

  const input = await request.json().catch(() => null)
  const email = String(input?.email ?? '').trim().toLowerCase()
  const password = String(input?.password ?? '')
  const name = String(input?.name ?? '').trim() || 'Tehran administrator'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
    password.length < 16 || password.length > 256 || name.length > 120) {
    return NextResponse.json({ error: 'Valid email, name, and a 16+ character password are required.' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const existing = await payload.find({ collection: 'users', depth: 0, limit: 1, overrideAccess: true })
  if (existing.totalDocs) return NextResponse.json({ error: 'Setup is complete.' }, { status: 409 })

  await payload.create({ collection: 'users', overrideAccess: true,
    data: { email, password, name, role: 'hq-admin', assignedProjects: [] } })
  return NextResponse.json({ ok: true }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
}
