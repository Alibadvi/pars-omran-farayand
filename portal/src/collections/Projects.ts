import type { CollectionConfig } from 'payload'

import { accessibleProjects, portalIdentity } from '../lib/access'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'پروژه', plural: 'پروژه‌ها' },
  admin: { useAsTitle: 'name', group: 'پروژه‌ها', defaultColumns: ['code', 'name', 'status', 'updatedAt'] },
  access: {
    read: ({ req }) => accessibleProjects(req),
    create: async ({ req }) => (await portalIdentity(req))?.role === 'hq-admin',
    update: async ({ req }) => (await portalIdentity(req))?.role === 'hq-admin',
    delete: async ({ req }) => (await portalIdentity(req))?.role === 'hq-admin',
  },
  versions: { maxPerDoc: 50 },
  fields: [
    { name: 'code', label: 'کد پروژه', type: 'text', required: true, unique: true },
    { name: 'name', label: 'نام پروژه', type: 'text', required: true },
    { name: 'site', label: 'محل سایت', type: 'text', required: true },
    { name: 'client', label: 'کارفرما', type: 'text' },
    {
      name: 'status', label: 'وضعیت', type: 'select', required: true, defaultValue: 'planning',
      options: [
        { label: 'در برنامه‌ریزی', value: 'planning' },
        { label: 'در حال اجرا', value: 'active' },
        { label: 'متوقف‌شده', value: 'on-hold' },
        { label: 'تکمیل‌شده', value: 'completed' },
      ],
    },
    { name: 'summary', label: 'شرح کوتاه پروژه', type: 'textarea' },
  ],
}
