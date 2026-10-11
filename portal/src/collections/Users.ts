import type { CollectionConfig } from 'payload'

import { portalIdentity } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email', group: 'Administration' },
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: async ({ req }) => (await portalIdentity(req))?.role === 'hq-admin',
    read: async ({ req }) => {
      const identity = await portalIdentity(req)
      if (!identity) return false
      return identity.role === 'hq-admin' ? true : { id: { equals: identity.id } }
    },
    update: async ({ req }) => (await portalIdentity(req))?.role === 'hq-admin',
    delete: async ({ req }) => (await portalIdentity(req))?.role === 'hq-admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role', type: 'select', required: true, defaultValue: 'site-staff',
      options: [
        { label: 'Tehran administrator', value: 'hq-admin' },
        { label: 'Tehran staff', value: 'hq-staff' },
        { label: 'Site manager', value: 'site-manager' },
        { label: 'Site staff', value: 'site-staff' },
      ],
      access: { update: ({ req }) => req.user?.role === 'hq-admin' },
    },
    {
      name: 'assignedProjects', type: 'relationship', relationTo: 'projects', hasMany: true,
      admin: { description: 'Site roles can only see these projects. Tehran roles can see all projects.' },
    },
  ],
}
