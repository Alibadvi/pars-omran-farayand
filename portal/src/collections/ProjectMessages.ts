import type { CollectionConfig } from 'payload'

import { portalIdentity, projectRecordAccess, requireProjectAccess } from '../lib/access'

export const ProjectMessages: CollectionConfig = {
  slug: 'project-messages',
  labels: { singular: 'پیام داخلی', plural: 'گفتگوهای داخلی' },
  admin: { useAsTitle: 'subject', group: 'ارتباطات', defaultColumns: ['subject', 'project', 'author', 'createdAt'] },
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
    { name: 'project', label: 'پروژه', type: 'relationship', relationTo: 'projects', required: true, index: true },
    { name: 'subject', label: 'موضوع', type: 'text', required: true },
    { name: 'body', label: 'متن پیام', type: 'textarea', required: true },
    { name: 'author', label: 'فرستنده', type: 'relationship', relationTo: 'users', required: true, admin: { readOnly: true } },
  ],
}
