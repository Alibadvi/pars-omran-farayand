import { ValidationError, type CollectionConfig, type Where } from 'payload'

import { portalIdentity, projectRecordAccess, referenceID, requireProjectAccess } from '../lib/access'
import { requiredBody, requiredText, trimText } from '../lib/validation'

async function messageWriteAccess(req: Parameters<typeof portalIdentity>[0]) {
  const identity = await portalIdentity(req)
  if (!identity) return false
  const projects = await projectRecordAccess(req)
  if (projects === false) return false
  if (identity.role === 'hq-admin') return projects
  const author = { author: { equals: identity.id } }
  return projects === true ? author : { and: [projects, author] }
}

async function validateRecipient(req: Parameters<typeof portalIdentity>[0], project: number | string, recipient: unknown) {
  const id = referenceID(recipient as number | string | { id: number | string } | null)
  if (id === undefined) return null // Project-wide announcement.
  const user = await req.payload.findByID({ collection: 'users', id, depth: 0, overrideAccess: true, req })
  if (!user.role.startsWith('hq-') && !(user.assignedProjects || []).some((assigned) => String(referenceID(assigned)) === String(project))) {
    throw new ValidationError({ collection: 'project-messages', req, errors: [{ path: 'recipient', message: 'گیرنده باید از همکاران همین پروژه یا دفتر تهران باشد.' }] })
  }
  return id
}

export const ProjectMessages: CollectionConfig = {
  slug: 'project-messages',
  labels: { singular: 'پیام داخلی', plural: 'گفتگوهای داخلی' },
  admin: {
    useAsTitle: 'subject', group: 'ارتباطات', defaultColumns: ['subject', 'project', 'author', 'recipient', 'createdAt'],
    listSearchableFields: ['subject', 'body'],
    description: 'همه اعضای مجاز پروژه پیام را می‌بینند، حتی اگر گیرنده مشخصی انتخاب کنید. برای گفتگوی روزانه از فضای کاری پروژه استفاده کنید.',
  },
  defaultSort: '-createdAt',
  access: {
    read: ({ req }) => projectRecordAccess(req),
    create: async ({ req }) => Boolean(await portalIdentity(req)),
    update: ({ req }) => messageWriteAccess(req),
    delete: ({ req }) => messageWriteAccess(req),
  },
  hooks: {
    beforeValidate: [async ({ data, operation, req }) => {
      if (operation === 'create') {
        const project = await requireProjectAccess(req, data?.project)
        return { ...data, project, author: req.user?.id, recipient: await validateRecipient(req, project, data?.recipient) }
      }
      return data
    }],
    beforeChange: [async ({ data, operation, originalDoc, req }) => {
      if (operation !== 'update') return data
      const project = await requireProjectAccess(req, originalDoc.project)
      if ('project' in data && String(referenceID(data.project)) !== String(project)) throw new ValidationError({ collection: 'project-messages', req, errors: [{ path: 'project', message: 'پروژه یک پیام ثبت‌شده قابل تغییر نیست.' }] })
      if ('author' in data && String(referenceID(data.author)) !== String(referenceID(originalDoc.author))) throw new ValidationError({ collection: 'project-messages', req, errors: [{ path: 'author', message: 'فرستنده پیام قابل تغییر نیست.' }] })
      return { ...data, project, author: referenceID(originalDoc.author), recipient: await validateRecipient(req, project, 'recipient' in data ? data.recipient : originalDoc.recipient), editedAt: new Date().toISOString() }
    }],
  },
  fields: [
    { name: 'project', label: 'پروژه', type: 'relationship', relationTo: 'projects', required: true, index: true, admin: { description: 'پروژه مقصد را قبل از انتخاب گیرنده مشخص کنید.' } },
    { name: 'subject', label: 'موضوع', type: 'text', required: true, maxLength: 180, validate: requiredText, hooks: { beforeValidate: [trimText] } },
    { name: 'body', label: 'متن پیام', type: 'textarea', required: true, maxLength: 20000, validate: requiredBody, hooks: { beforeValidate: [trimText] }, admin: { rows: 8 } },
    { name: 'author', label: 'فرستنده', type: 'relationship', relationTo: 'users', required: true, admin: { readOnly: true, position: 'sidebar' } },
    { name: 'recipient', label: 'گیرنده', type: 'relationship', relationTo: 'users',
      // Users can address colleagues without gaining read access to their accounts.
      // The hooks above verify existence and project membership on every write.
      validate: (value: unknown) => value == null ||
        (typeof value === 'number' && Number.isSafeInteger(value) && value > 0) ||
        (typeof value === 'string' && /^[1-9]\d*$/.test(value)) || 'گیرنده نامعتبر است.',
      filterOptions: ({ data }): Where | false => {
        const project = referenceID(data?.project)
        return project === undefined ? false : { or: [{ role: { in: ['hq-admin', 'hq-staff'] } }, { assignedProjects: { contains: project } }] }
      },
      admin: { description: 'انتخاب گیرنده، پیام را خصوصی نمی‌کند. برای خطاب به همه اعضای پروژه، این قسمت را خالی بگذارید.' },
    },
    { name: 'editedAt', label: 'آخرین ویرایش', type: 'date', admin: { readOnly: true, position: 'sidebar' } },
  ],
}
