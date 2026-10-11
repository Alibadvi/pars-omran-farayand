import path from 'node:path'
import type { CollectionConfig } from 'payload'

import { portalIdentity, projectRecordAccess, requireProjectAccess } from '../lib/access'

export const ProjectDocuments: CollectionConfig = {
  slug: 'project-documents',
  labels: { singular: 'سند پروژه', plural: 'اسناد پروژه' },
  admin: { useAsTitle: 'title', group: 'پروژه‌ها', defaultColumns: ['title', 'project', 'category', 'updatedAt'] },
  upload: {
    staticDir: process.env.PORTAL_UPLOAD_DIR || (process.env.NODE_ENV !== 'production' && process.env.PORTAL_LOCAL_SQLITE === '1'
      ? path.resolve(process.cwd(), '.local-data/files')
      : path.resolve(process.cwd(), '..', 'portal-private-files')),
    mimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
  access: {
    read: ({ req }) => projectRecordAccess(req),
    create: async ({ req }) => Boolean(await portalIdentity(req)),
    update: () => false,
    delete: () => false,
  },
  hooks: {
    beforeValidate: [async ({ data, operation, req }) => {
      if (operation === 'create') {
        const project = await requireProjectAccess(req, data?.project)
        let revision = 1
        if (data?.supersedes) {
          const previous = await req.payload.findByID({ collection: 'project-documents', id: data.supersedes, depth: 0, overrideAccess: true, req })
          if (String(previous.project) !== String(project)) throw new Error('A document can only supersede a file in the same project.')
          revision = (previous.revision || 1) + 1
        }
        return { ...data, project, revision, uploadedBy: req.user?.id }
      }
      return data
    }],
  },
  fields: [
    { name: 'title', label: 'عنوان سند', type: 'text', required: true },
    { name: 'project', label: 'پروژه', type: 'relationship', relationTo: 'projects', required: true, index: true },
    { name: 'category', label: 'دسته‌بندی', type: 'select', required: true, options: [
      { label: 'قرارداد', value: 'contract' },
      { label: 'نقشه', value: 'drawing' },
      { label: 'مکاتبه', value: 'correspondence' },
      { label: 'گزارش پیشرفت', value: 'progress' },
      { label: 'سایر', value: 'other' },
    ] },
    { name: 'notes', label: 'توضیحات', type: 'textarea' },
    { name: 'supersedes', label: 'نسخه قبلی', type: 'relationship', relationTo: 'project-documents', admin: { description: 'اگر این فایل نسخه جدیدی از یک سند است، نسخه قبلی را انتخاب کنید.' } },
    { name: 'revision', label: 'شماره نسخه', type: 'number', required: true, defaultValue: 1, admin: { readOnly: true } },
    { name: 'uploadedBy', label: 'بارگذاری‌کننده', type: 'relationship', relationTo: 'users', admin: { readOnly: true } },
  ],
}
