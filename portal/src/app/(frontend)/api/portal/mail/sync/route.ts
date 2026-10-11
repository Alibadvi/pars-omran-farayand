import { timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { accessToken, graphRequest, GRAPH, MAILBOX } from '@/lib/mail'
import config from '@/payload.config'

type GraphMessage = {
  id: string
  conversationId?: string
  internetMessageId?: string
  receivedDateTime?: string
  subject?: string
  body?: { content?: string }
  from?: { emailAddress?: { address?: string } }
  toRecipients?: Array<{ emailAddress?: { address?: string } }>
  '@removed'?: unknown
}

type DeltaPage = { value: GraphMessage[]; '@odata.nextLink'?: string; '@odata.deltaLink'?: string }

/** Call every few minutes from a server-side scheduler. Never expose MAIL_SYNC_KEY to browsers. */
export async function POST(request: NextRequest) {
  const expected = process.env.MAIL_SYNC_KEY
  const provided = request.headers.get('x-portal-sync-key')
  if (!expected || !provided || expected.length !== provided.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(provided))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const state = await payload.findGlobal({ slug: 'mail-state', overrideAccess: true })
  if (!state.connectedAt) return NextResponse.json({ error: 'Mailbox not connected' }, { status: 503 })
  const token = await accessToken(payload)
  const initial = new URL(`${GRAPH}/me/mailFolders/inbox/messages/delta`)
  initial.searchParams.set('$select', 'id,conversationId,internetMessageId,subject,body,from,toRecipients,receivedDateTime')
  initial.searchParams.set('$filter', `receivedDateTime ge ${state.connectedAt}`)
  let cursor = state.inboxCursor || initial.toString()
  let imported = 0

  // Keep each request bounded; save opaque Graph cursors after every successful page.
  for (let pageNumber = 0; pageNumber < 5; pageNumber++) {
    const page = await graphRequest(token, cursor, { headers: { Prefer: 'outlook.body-content-type="text", odata.maxpagesize=50' } }) as DeltaPage
    for (const message of page.value) {
      if (message['@removed'] || !message.id || !message.conversationId) continue
      if (message.from?.emailAddress?.address?.toLowerCase() === MAILBOX) continue
      const sender = message.from?.emailAddress?.address
      if (!sender) continue
      const duplicate = await payload.find({ collection: 'external-emails', overrideAccess: true, depth: 0, limit: 1, where: { graphMessageId: { equals: message.id } } })
      if (duplicate.totalDocs) continue
      const matches = await payload.find({ collection: 'external-emails', overrideAccess: true, depth: 0, limit: 2,
        where: { and: [ { conversationId: { equals: message.conversationId } }, { direction: { equals: 'outbound' } } ] } })
      if (!matches.docs.length) continue
      const projects = new Set(matches.docs.map((mail) => String(mail.project)))
      if (projects.size !== 1) {
        console.error('Ambiguous Outlook conversation; reply not imported:', message.id)
        continue
      }
      const project = matches.docs[0].project
      await payload.create({ collection: 'external-emails', overrideAccess: true, data: {
        project, direction: 'inbound', subject: message.subject || '(بدون موضوع)',
        body: message.body?.content || '', from: sender,
        to: (message.toRecipients || []).map((recipient) => recipient.emailAddress?.address).filter(Boolean).join(', ') || MAILBOX,
        status: 'received', graphMessageId: message.id, conversationId: message.conversationId,
        internetMessageId: message.internetMessageId, occurredAt: message.receivedDateTime || new Date().toISOString(),
      } })
      imported++
    }
    const next = page['@odata.nextLink'] || page['@odata.deltaLink']
    if (!next) throw new Error('Outlook did not return a synchronization cursor.')
    const nextURL = new URL(next)
    if (nextURL.origin !== 'https://graph.microsoft.com' || !nextURL.pathname.startsWith('/v1.0/me/mailFolders/inbox/messages/delta')) throw new Error('Invalid Outlook cursor.')
    await payload.updateGlobal({ slug: 'mail-state', overrideAccess: true, data: { inboxCursor: next } })
    cursor = next
    if (page['@odata.deltaLink']) break
  }
  return NextResponse.json({ ok: true, imported })
}
