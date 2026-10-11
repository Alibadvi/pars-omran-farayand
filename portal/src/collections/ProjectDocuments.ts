import path from 'node:path'
import type { CollectionConfig } from 'payload'

import { portalIdentity, projectRecordAccess, requireProjectAccess } from '../lib/access'

export const ProjectDocuments: CollectionConfig = {
  slug: 'project-documents',
  admin: { useAsTitle: 'title', group: 'Projects', defaultColumns: ['title', 'project', 'category', 'updatedAt'] },
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
    { name: 'title', type: 'text', required: true },
    { name: 'project', type: 'relationship', relationTo: 'projects', required: true, index: true },
    { name: 'category', type: 'select', required: true, options: [
      { label: 'Contract', value: 'contract' },
      { label: 'Drawing', value: 'drawing' },
      { label: 'Correspondence', value: 'correspondence' },
      { label: 'Progress report', value: 'progress' },
      { label: 'Other', value: 'other' },
    ] },
    { name: 'notes', type: 'textarea' },
    { name: 'supersedes', type: 'relationship', relationTo: 'project-documents', admin: { description: 'Select the previous document when uploading a new revision.' } },
    { name: 'revision', type: 'number', required: true, defaultValue: 1, admin: { readOnly: true } },
    { name: 'uploadedBy', type: 'relationship', relationTo: 'users', admin: { readOnly: true } },
  ],
}
