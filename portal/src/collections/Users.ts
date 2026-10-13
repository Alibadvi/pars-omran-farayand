import type { CollectionConfig } from 'payload'

import { portalIdentity } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'همکار', plural: 'همکاران' },
  // Keep existing email accounts working while allowing colleagues to use only a username.
  auth: { loginWithUsername: { allowEmailLogin: true, requireEmail: false, requireUsername: false } },
  admin: { useAsTitle: 'name', group: 'مدیریت', defaultColumns: ['name', 'username', 'role', 'updatedAt'] },
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
    { name: 'name', label: 'نام و نام خانوادگی', type: 'text', required: true },
    {
      name: 'role', label: 'نقش', type: 'select', required: true, defaultValue: 'site-staff',
      options: [
        { label: 'مدیر دفتر تهران', value: 'hq-admin' },
        { label: 'همکار دفتر تهران', value: 'hq-staff' },
        { label: 'مدیر سایت پروژه', value: 'site-manager' },
        { label: 'همکار سایت پروژه', value: 'site-staff' },
      ],
      access: { update: ({ req }) => req.user?.role === 'hq-admin' },
    },
    {
      name: 'assignedProjects', label: 'پروژه‌های مجاز', type: 'relationship', relationTo: 'projects', hasMany: true,
      admin: { description: 'همکاران سایت فقط پروژه‌های تعیین‌شده را می‌بینند. دفتر تهران به همه پروژه‌ها دسترسی دارد.' },
    },
  ],
}
