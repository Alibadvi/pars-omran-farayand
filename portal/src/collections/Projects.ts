import { APIError, type CollectionConfig } from 'payload'

import { accessibleProjects, portalIdentity } from '../lib/access'
import { requiredText, trimText } from '../lib/validation'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'پروژه', plural: 'پروژه‌ها' },
  admin: {
    useAsTitle: 'name', group: 'پروژه‌ها', defaultColumns: ['code', 'name', 'site', 'status', 'updatedAt'],
    listSearchableFields: ['code', 'name', 'site', 'client'],
    description: 'اطلاعات پایه و وضعیت پروژه را ثبت کنید. اسناد و گفتگوها در فضای کاری هر پروژه در دسترس‌اند.',
    pagination: { defaultLimit: 20, limits: [10, 20, 50] },
  },
  defaultSort: '-updatedAt',
  access: {
    read: ({ req }) => accessibleProjects(req),
    create: async ({ req }) => (await portalIdentity(req))?.role === 'hq-admin',
    update: async ({ req }) => (await portalIdentity(req))?.role === 'hq-admin',
    delete: async ({ req }) => (await portalIdentity(req))?.role === 'hq-admin',
  },
  versions: { maxPerDoc: 50 },
  hooks: {
    beforeDelete: [async ({ id, req }) => {
      const shared = { req, overrideAccess: true as const }
      const related = await Promise.all([
        req.payload.count({ ...shared, collection: 'project-documents', where: { project: { equals: id } } }),
        req.payload.count({ ...shared, collection: 'project-messages', where: { project: { equals: id } } }),
        req.payload.count({ ...shared, collection: 'external-emails', where: { project: { equals: id } } }),
        req.payload.count({ ...shared, collection: 'users', where: { assignedProjects: { contains: id } } }),
      ])
      if (related.some((result) => result.totalDocs > 0)) {
        throw new APIError('این پروژه سند، پیام، ایمیل یا همکار مرتبط دارد. برای حفظ سوابق، وضعیت آن را به «تکمیل‌شده» یا «متوقف‌شده» تغییر دهید.', 400)
      }
    }],
  },
  fields: [
    { type: 'row', fields: [
      { name: 'name', label: 'نام پروژه', type: 'text', required: true, maxLength: 180, validate: requiredText, hooks: { beforeValidate: [trimText] }, admin: { width: '65%', placeholder: 'مثلاً احداث واحد فرآیندی' } },
      { name: 'code', label: 'کد پروژه', type: 'text', required: true, unique: true, maxLength: 60, validate: requiredText, hooks: { beforeValidate: [trimText] }, admin: { width: '35%', description: 'کد یکتای پروژه؛ برای جستجو و شناسایی سریع.' } },
    ] },
    { type: 'row', fields: [
      { name: 'site', label: 'محل سایت', type: 'text', required: true, maxLength: 180, validate: requiredText, hooks: { beforeValidate: [trimText] }, admin: { width: '50%' } },
      { name: 'client', label: 'کارفرما', type: 'text', maxLength: 180, hooks: { beforeValidate: [trimText] }, admin: { width: '50%' } },
    ] },
    {
      name: 'status', label: 'وضعیت', type: 'select', required: true, defaultValue: 'planning',
      admin: { position: 'sidebar', description: 'وضعیت واقعی پروژه را به‌روز نگه دارید.' },
      options: [
        { label: 'در برنامه‌ریزی', value: 'planning' },
        { label: 'در حال اجرا', value: 'active' },
        { label: 'متوقف‌شده', value: 'on-hold' },
        { label: 'تکمیل‌شده', value: 'completed' },
      ],
    },
    { name: 'summary', label: 'شرح کوتاه پروژه', type: 'textarea', maxLength: 3000, hooks: { beforeValidate: [trimText] }, admin: { rows: 5, description: 'این توضیح در فضای کاری پروژه نمایش داده می‌شود.' } },
  ],
}
