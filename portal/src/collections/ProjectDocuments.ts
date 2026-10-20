import path from 'node:path'
import { ValidationError, type CollectionConfig, type Where } from 'payload'

import { portalIdentity, projectRecordAccess, referenceID, requireProjectAccess } from '../lib/access'
import { requiredText, trimText } from '../lib/validation'

export const ProjectDocuments: CollectionConfig = {
  slug: 'project-documents',
  labels: { singular: 'سند پروژه', plural: 'اسناد پروژه' },
  admin: { useAsTitle: 'title', group: 'پروژه‌ها', defaultColumns: ['title', 'project', 'category', 'revision', 'createdAt'], listSearchableFields: ['title', 'notes', 'filename'], description: 'اسناد پس از ثبت تغییر نمی‌کنند. برای اصلاح فایل، سند جدید بارگذاری کرده و «نسخه قبلی» را انتخاب کنید.' },
  defaultSort: '-createdAt',
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
          const previous = await req.payload.findByID({ collection: 'project-documents', id: referenceID(data.supersedes)!, depth: 0, overrideAccess: true, req })
          if (String(referenceID(previous.project)) !== String(project)) throw new ValidationError({ collection: 'project-documents', req, errors: [{ path: 'supersedes', message: 'نسخه قبلی باید متعلق به همین پروژه باشد.' }] })
          revision = (previous.revision || 1) + 1
        }
        return { ...data, project, revision, uploadedBy: req.user?.id }
      }
      return data
    }],
  },
  fields: [
    { name: 'title', label: 'عنوان سند', type: 'text', required: true, maxLength: 180, validate: requiredText, hooks: { beforeValidate: [trimText] } },
    { name: 'project', label: 'پروژه', type: 'relationship', relationTo: 'projects', required: true, index: true },
    { name: 'category', label: 'دسته‌بندی', type: 'select', required: true, options: [
      { label: 'قرارداد', value: 'contract' },
      { label: 'نقشه', value: 'drawing' },
      { label: 'مکاتبه', value: 'correspondence' },
      { label: 'گزارش پیشرفت', value: 'progress' },
      { label: 'سایر', value: 'other' },
    ] },
    { name: 'notes', label: 'توضیحات', type: 'textarea', maxLength: 3000, hooks: { beforeValidate: [trimText] } },
    { name: 'supersedes', label: 'نسخه قبلی', type: 'relationship', relationTo: 'project-documents',
      filterOptions: ({ data }): Where | false => {
        const project = referenceID(data?.project)
        return project === undefined ? false : { project: { equals: project } }
      },
      admin: { description: 'ابتدا پروژه را انتخاب کنید. تنها اسناد همان پروژه قابل انتخاب‌اند؛ شماره نسخه خودکار محاسبه می‌شود.' },
    },
    { name: 'revision', label: 'شماره نسخه', type: 'number', required: true, defaultValue: 1, admin: { readOnly: true, position: 'sidebar' } },
    { name: 'uploadedBy', label: 'بارگذاری‌کننده', type: 'relationship', relationTo: 'users', admin: { readOnly: true, position: 'sidebar' } },
  ],
}
