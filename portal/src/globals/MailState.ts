import type { GlobalConfig } from 'payload'

/** A single Outlook mailbox, connected by a Tehran administrator. */
export const MailState: GlobalConfig = {
  slug: 'mail-state',
  admin: { hidden: true },
  access: {
    read: () => false,
    update: () => false,
  },
  fields: [
    { name: 'connectedAddress', type: 'email' },
    { name: 'connectedAt', type: 'date' },
    { name: 'refreshTokenEncrypted', type: 'textarea', admin: { hidden: true } },
    { name: 'inboxCursor', type: 'textarea', admin: { hidden: true } },
  ],
}
