import type { CollectionConfig } from 'payload'

import { accessibleProjects, portalIdentity } from '../lib/access'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: { useAsTitle: 'name', group: 'Projects', defaultColumns: ['code', 'name', 'status', 'updatedAt'] },
  access: {
    read: ({ req }) => accessibleProjects(req),
    create: async ({ req }) => (await portalIdentity(req))?.role === 'hq-admin',
    update: async ({ req }) => (await portalIdentity(req))?.role === 'hq-admin',
    delete: async ({ req }) => (await portalIdentity(req))?.role === 'hq-admin',
  },
  versions: { maxPerDoc: 50 },
  fields: [
    { name: 'code', type: 'text', required: true, unique: true },
    { name: 'name', type: 'text', required: true },
    { name: 'site', type: 'text', required: true },
    { name: 'client', type: 'text' },
    {
      name: 'status', type: 'select', required: true, defaultValue: 'planning',
      options: [
        { label: 'Planning', value: 'planning' },
        { label: 'Active', value: 'active' },
        { label: 'On hold', value: 'on-hold' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    { name: 'summary', type: 'textarea' },
  ],
}
