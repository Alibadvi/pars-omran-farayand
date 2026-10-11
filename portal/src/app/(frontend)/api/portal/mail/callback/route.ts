import { timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

import { encryptToken, exchangeToken, GRAPH, MAILBOX, mailConfig, SCOPES } from '@/lib/mail'
import { authenticatedSession } from '@/lib/session'

export async function GET(request: NextRequest) {
  const session = await authenticatedSession(request.headers)
  if (session?.identity.role !== 'hq-admin') return NextResponse.json({ error: 'Tehran administrator access required.' }, { status: 403 })
  const expected = request.cookies.get('outlook_oauth_state')?.value
  const state = request.nextUrl.searchParams.get('state')
  const code = request.nextUrl.searchParams.get('code')
  if (!expected || !state || !code || expected.length !== state.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(state))) {
    return NextResponse.json({ error: 'Invalid or expired Outlook authorization.' }, { status: 400 })
  }

  const { clientId, clientSecret, redirectURI } = mailConfig()
  const token = await exchangeToken(new URLSearchParams({
    client_id: clientId, client_secret: clientSecret, redirect_uri: redirectURI,
    grant_type: 'authorization_code', code, scope: SCOPES,
  }))
  if (!token.refresh_token) return NextResponse.json({ error: 'Outlook did not grant offline access.' }, { status: 400 })

  const profileResponse = await fetch(`${GRAPH}/me?$select=mail,userPrincipalName`, {
    headers: { Authorization: `Bearer ${token.access_token}` }, cache: 'no-store',
  })
  if (!profileResponse.ok) return NextResponse.json({ error: 'Could not verify Outlook account.' }, { status: 502 })
  const profile = await profileResponse.json() as { mail?: string; userPrincipalName?: string }
  if (![profile.mail, profile.userPrincipalName].some((address) => address?.toLowerCase() === MAILBOX)) {
    return NextResponse.json({ error: `Connect ${MAILBOX}, not a different Microsoft account.` }, { status: 403 })
  }

  await session.payload.updateGlobal({ slug: 'mail-state', overrideAccess: true, data: {
    connectedAddress: MAILBOX, connectedAt: new Date().toISOString(),
    refreshTokenEncrypted: encryptToken(token.refresh_token), inboxCursor: '',
  } })
  const response = NextResponse.redirect(new URL('/?mail=connected', process.env.PORTAL_URL || request.url))
  response.cookies.set('outlook_oauth_state', '', { path: '/api/portal/mail/callback', maxAge: 0 })
  return response
}
