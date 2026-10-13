import type { CollectionConfig } from 'payload'

import { portalIdentity, projectRecordAccess, referenceID, requireProjectAccess } from '../lib/access'

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
    throw new Error('The recipient is not assigned to this project.')
  }
  return id
}

export const ProjectMessages: CollectionConfig = {
  slug: 'project-messages',
  labels: { singular: 'پیام داخلی', plural: 'گفتگوهای داخلی' },
  admin: { useAsTitle: 'subject', group: 'ارتباطات', defaultColumns: ['subject', 'project', 'author', 'recipient', 'createdAt'] },
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
      if (data.project != null && String(referenceID(data.project)) !== String(project)) throw new Error('A message cannot move to another project.')
      if (data.author != null && String(referenceID(data.author)) !== String(referenceID(originalDoc.author))) throw new Error('The sender cannot be changed.')
      return { ...data, project, author: referenceID(originalDoc.author), recipient: await validateRecipient(req, project, 'recipient' in data ? data.recipient : originalDoc.recipient), editedAt: new Date().toISOString() }
    }],
  },
  fields: [
    { name: 'project', label: 'پروژه', type: 'relationship', relationTo: 'projects', required: true, index: true },
    { name: 'subject', label: 'موضوع', type: 'text', required: true },
    { name: 'body', label: 'متن پیام', type: 'textarea', required: true },
    { name: 'author', label: 'فرستنده', type: 'relationship', relationTo: 'users', required: true, admin: { readOnly: true } },
    { name: 'recipient', label: 'گیرنده', type: 'relationship', relationTo: 'users', admin: { description: 'خالی بگذارید تا پیام خطاب به همه اعضای پروژه باشد. همه اعضای مجاز پروژه پیام‌ها را می‌بینند.' } },
    { name: 'editedAt', label: 'آخرین ویرایش', type: 'date', admin: { readOnly: true } },
  ],
}
