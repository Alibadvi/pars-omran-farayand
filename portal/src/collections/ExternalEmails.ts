import type { CollectionConfig } from 'payload'

import { projectRecordAccess } from '../lib/access'

/** Written only by the mail integration, not through Payload's public create API. */
export const ExternalEmails: CollectionConfig = {
  slug: 'external-emails',
  admin: { useAsTitle: 'subject', group: 'Communication', defaultColumns: ['subject', 'project', 'direction', 'status', 'createdAt'] },
  access: {
    read: ({ req }) => projectRecordAccess(req),
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'project', type: 'relationship', relationTo: 'projects', required: true, index: true },
    { name: 'direction', type: 'select', required: true, options: ['outbound', 'inbound'] },
    { name: 'subject', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    { name: 'from', type: 'email', required: true },
    { name: 'to', type: 'text', required: true },
    { name: 'sentBy', type: 'relationship', relationTo: 'users' },
    { name: 'status', type: 'select', required: true, options: ['pending', 'accepted', 'received', 'failed'] },
    { name: 'occurredAt', type: 'date', required: true },
    { name: 'graphMessageId', type: 'text', unique: true },
    { name: 'clientRequestId', type: 'text', unique: true },
    { name: 'conversationId', type: 'text', index: true },
    { name: 'internetMessageId', type: 'text' },
  ],
}
