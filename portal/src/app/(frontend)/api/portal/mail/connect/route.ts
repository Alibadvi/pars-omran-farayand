import { randomBytes } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

import { mailConfig, OAUTH, SCOPES } from '@/lib/mail'
import { authenticatedSession } from '@/lib/session'

export async function GET(request: NextRequest) {
  const session = await authenticatedSession(request.headers)
  if (session?.identity.role !== 'hq-admin') return NextResponse.json({ error: 'Tehran administrator access required.' }, { status: 403 })

  let clientId: string
  let redirectURI: string
  try { ({ clientId, redirectURI } = mailConfig()) }
  catch { return NextResponse.json({ error: 'اتصال Outlook هنوز روی سرور تنظیم نشده است.' }, { status: 503 }) }
  const state = randomBytes(32).toString('hex')
  const authorize = new URL(`${OAUTH}/authorize`)
  authorize.search = new URLSearchParams({
    client_id: clientId, response_type: 'code', redirect_uri: redirectURI,
    response_mode: 'query', scope: SCOPES, state, prompt: 'select_account',
  }).toString()
  const response = NextResponse.redirect(authorize)
  response.cookies.set('outlook_oauth_state', state, {
    httpOnly: true, secure: new URL(process.env.PORTAL_URL || request.url).protocol === 'https:', sameSite: 'lax',
    path: '/api/portal/mail/callback', maxAge: 600,
  })
  return response
}
