import type { CollectionConfig } from 'payload'

import { portalIdentity, projectRecordAccess, requireProjectAccess } from '../lib/access'

export const ProjectMessages: CollectionConfig = {
  slug: 'project-messages',
  admin: { useAsTitle: 'subject', group: 'Communication', defaultColumns: ['subject', 'project', 'author', 'createdAt'] },
  access: {
    read: ({ req }) => projectRecordAccess(req),
    create: async ({ req }) => Boolean(await portalIdentity(req)),
    update: () => false,
    delete: () => false,
  },
  hooks: {
    beforeValidate: [async ({ data, operation, req }) => {
      if (operation !== 'create') return data
      await requireProjectAccess(req, data?.project)
      return { ...data, author: req.user?.id }
    }],
  },
  fields: [
    { name: 'project', type: 'relationship', relationTo: 'projects', required: true, index: true },
    { name: 'subject', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    { name: 'author', type: 'relationship', relationTo: 'users', required: true, admin: { readOnly: true } },
  ],
}
