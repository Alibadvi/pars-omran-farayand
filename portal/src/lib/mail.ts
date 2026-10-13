import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import type { Payload } from 'payload'

export const MAILBOX = process.env.MS_GRAPH_MAILBOX?.trim().toLowerCase() || ''
export const GRAPH = 'https://graph.microsoft.com/v1.0'
// The default supports both work/school and personal Microsoft accounts. A single-tenant
// registration can set MS_GRAPH_TENANT_ID to its directory ID instead.
const tenant = process.env.MS_GRAPH_TENANT_ID || 'common'
if (!/^(common|organizations|consumers|[0-9a-f-]{36})$/i.test(tenant)) throw new Error('Invalid Microsoft tenant ID.')
export const OAUTH = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0`
export const SCOPES = 'offline_access User.Read Mail.ReadWrite Mail.Send'

export function mailConfig() {
  const clientId = process.env.MS_GRAPH_CLIENT_ID
  const clientSecret = process.env.MS_GRAPH_CLIENT_SECRET
  const portalURL = process.env.PORTAL_URL
  const key = process.env.PORTAL_ENCRYPTION_KEY
  if (!clientId || !clientSecret || !portalURL || !MAILBOX || !key || !/^[0-9a-f]{64}$/i.test(key)) {
    throw new Error('Outlook integration is not configured.')
  }
  const base = new URL(portalURL)
  if (base.protocol !== 'https:' && base.hostname !== 'localhost') throw new Error('HTTPS is required for Outlook authorization.')
  return { clientId, clientSecret, redirectURI: new URL('/api/portal/mail/callback', base).toString(), key: Buffer.from(key, 'hex') }
}

export function encryptToken(value: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', mailConfig().key, iv)
  const data = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  return `${iv.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}.${data.toString('base64url')}`
}

export function decryptToken(value: string): string {
  const [iv, tag, data] = value.split('.')
  if (!iv || !tag || !data) throw new Error('Invalid stored mail token.')
  const decipher = createDecipheriv('aes-256-gcm', mailConfig().key, Buffer.from(iv, 'base64url'))
  decipher.setAuthTag(Buffer.from(tag, 'base64url'))
  return Buffer.concat([decipher.update(Buffer.from(data, 'base64url')), decipher.final()]).toString('utf8')
}

export async function exchangeToken(params: URLSearchParams) {
  const response = await fetch(`${OAUTH}/token`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params, cache: 'no-store' })
  if (!response.ok) throw new Error(`Outlook authorization failed (${response.status}).`)
  const result = await response.json() as { access_token?: string; refresh_token?: string }
  if (!result.access_token) throw new Error('Outlook did not return an access token.')
  return result
}

export async function accessToken(payload: Payload): Promise<string> {
  const state = await payload.findGlobal({ slug: 'mail-state', overrideAccess: true })
  if (!state.refreshTokenEncrypted || state.connectedAddress?.toLowerCase() !== MAILBOX) throw new Error('Outlook mailbox is not connected.')
  const { clientId, clientSecret } = mailConfig()
  const refreshed = await exchangeToken(new URLSearchParams({
    client_id: clientId, client_secret: clientSecret, grant_type: 'refresh_token',
    refresh_token: decryptToken(state.refreshTokenEncrypted), scope: SCOPES,
  }))
  if (refreshed.refresh_token) {
    await payload.updateGlobal({ slug: 'mail-state', overrideAccess: true, data: { refreshTokenEncrypted: encryptToken(refreshed.refresh_token) } })
  }
  return refreshed.access_token!
}

export async function graphRequest(token: string, path: string, init: RequestInit = {}) {
  const url = new URL(path, GRAPH)
  if (url.origin !== 'https://graph.microsoft.com' || !url.pathname.startsWith('/v1.0/me/')) {
    throw new Error('Invalid Microsoft Graph request URL.')
  }
  const response = await fetch(url, {
    ...init, cache: 'no-store',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', ...init.headers },
  })
  if (!response.ok) throw new Error(`Microsoft Graph request failed (${response.status}).`)
  if (response.status === 202 || response.status === 204) return null
  return response.json()
}
