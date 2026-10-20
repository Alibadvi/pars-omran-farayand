import { APIError, ValidationError, type CollectionConfig } from 'payload'

import { portalIdentity } from '../lib/access'
import { requiredText, trimText } from '../lib/validation'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'همکار', plural: 'همکاران' },
  // Keep existing email accounts working while allowing colleagues to use only a username.
  auth: { loginWithUsername: { allowEmailLogin: true, requireEmail: false, requireUsername: false } },
  admin: {
    useAsTitle: 'name', group: 'مدیریت', defaultColumns: ['name', 'username', 'role', 'assignedProjects'],
    listSearchableFields: ['name', 'username', 'email'],
    description: 'برای هر همکار نام، راه ورود و نقش را مشخص کنید. دسترسی همکاران سایت به پروژه‌های انتخاب‌شده محدود است.',
  },
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
  hooks: {
    beforeValidate: [({ data, originalDoc, operation, req }) => {
      const username = String((data && 'username' in data ? data.username : originalDoc?.username) ?? '').trim()
      const email = String((data && 'email' in data ? data.email : originalDoc?.email) ?? '').trim().toLowerCase()
      if (!username && !email) throw new ValidationError({ collection: 'users', req, errors: [{ path: 'username', message: 'حداقل نام کاربری یا ایمیل را برای ورود همکار وارد کنید.' }] })
      const role = data?.role ?? originalDoc?.role ?? 'site-staff'
      if (operation === 'update' && String(originalDoc?.id) === String(req.user?.id) && role !== 'hq-admin' && originalDoc?.role === 'hq-admin') {
        throw new ValidationError({ collection: 'users', req, errors: [{ path: 'role', message: 'نقش مدیریتی حساب فعلی را نمی‌توانید تغییر دهید. از مدیر دیگری بخواهید این تغییر را انجام دهد.' }] })
      }
      // Do not overwrite an unchanged login field on partial updates.
      return { ...data, ...(data && 'username' in data ? { username: username || null } : {}), ...(data && 'email' in data ? { email: email || null } : {}) }
    }],
    beforeDelete: [async ({ id, req }) => {
      if (String(id) === String(req.user?.id)) throw new APIError('حسابی که با آن وارد شده‌اید قابل حذف نیست.', 400)
      const shared = { req, overrideAccess: true as const }
      const references = await Promise.all([
        req.payload.count({ ...shared, collection: 'project-messages', where: { or: [{ author: { equals: id } }, { recipient: { equals: id } }] } }),
        req.payload.count({ ...shared, collection: 'project-documents', where: { uploadedBy: { equals: id } } }),
        req.payload.count({ ...shared, collection: 'external-emails', where: { sentBy: { equals: id } } }),
      ])
      if (references.some((result) => result.totalDocs > 0)) throw new APIError('این همکار در سوابق پروژه‌ها حضور دارد و قابل حذف نیست. دسترسی پروژه‌ها را مدیریت کنید.', 400)
    }],
  },
  fields: [
    { name: 'name', label: 'نام و نام خانوادگی', type: 'text', required: true, maxLength: 120, validate: requiredText, hooks: { beforeValidate: [trimText] } },
    {
      name: 'role', label: 'نقش', type: 'select', required: true, defaultValue: 'site-staff',
      options: [
        { label: 'مدیر دفتر تهران', value: 'hq-admin' },
        { label: 'همکار دفتر تهران', value: 'hq-staff' },
        { label: 'مدیر سایت پروژه', value: 'site-manager' },
        { label: 'همکار سایت پروژه', value: 'site-staff' },
      ],
      admin: { description: 'دفتر تهران همه پروژه‌ها را می‌بیند؛ همکاران سایت فقط پروژه‌های مشخص‌شده را می‌بینند.' },
      access: { update: async ({ req }) => (await portalIdentity(req))?.role === 'hq-admin' },
    },
    {
      name: 'assignedProjects', label: 'پروژه‌های مجاز', type: 'relationship', relationTo: 'projects', hasMany: true,
      admin: { description: 'همکاران سایت فقط پروژه‌های انتخاب‌شده را می‌بینند؛ بدون انتخاب، به هیچ پروژه‌ای دسترسی ندارند. دفتر تهران همه پروژه‌ها را می‌بیند.' },
    },
  ],
}
