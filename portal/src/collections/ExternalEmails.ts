import type { CollectionConfig } from 'payload'

import { projectRecordAccess } from '../lib/access'

/** Written only by the mail integration, not through Payload's public create API. */
export const ExternalEmails: CollectionConfig = {
  slug: 'external-emails',
  labels: { singular: 'ایمیل پروژه', plural: 'ایمیل‌های پروژه' },
  admin: { useAsTitle: 'subject', group: 'ارتباطات', defaultColumns: ['subject', 'project', 'direction', 'status', 'createdAt'] },
  access: {
    read: ({ req }) => projectRecordAccess(req),
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'project', label: 'پروژه', type: 'relationship', relationTo: 'projects', required: true, index: true },
    { name: 'direction', label: 'جهت', type: 'select', required: true, options: [{ label: 'ارسالی', value: 'outbound' }, { label: 'دریافتی', value: 'inbound' }] },
    { name: 'subject', label: 'موضوع', type: 'text', required: true },
    { name: 'body', label: 'متن', type: 'textarea', required: true },
    { name: 'from', label: 'فرستنده', type: 'email', required: true },
    { name: 'to', label: 'گیرنده', type: 'text', required: true },
    { name: 'sentBy', label: 'ارسال‌شده توسط', type: 'relationship', relationTo: 'users' },
    { name: 'status', label: 'وضعیت', type: 'select', required: true, options: [{ label: 'در حال بررسی', value: 'pending' }, { label: 'تحویل‌شده به Outlook', value: 'accepted' }, { label: 'دریافت‌شده', value: 'received' }, { label: 'ارسال ناموفق', value: 'failed' }] },
    { name: 'occurredAt', label: 'زمان', type: 'date', required: true },
    { name: 'graphMessageId', label: 'شناسه Outlook', type: 'text', unique: true },
    { name: 'clientRequestId', label: 'شناسه درخواست', type: 'text', unique: true },
    { name: 'conversationId', label: 'شناسه گفتگو', type: 'text', index: true },
    { name: 'internetMessageId', label: 'شناسه اینترنتی پیام', type: 'text' },
  ],
}
