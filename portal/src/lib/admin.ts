import type { Where } from 'payload'

import { projectStatusLabels } from './presentation'

export const portalRoleLabels: Record<string, string> = {
  'hq-admin': 'مدیر دفتر تهران',
  'hq-staff': 'همکار دفتر تهران',
  'site-manager': 'مدیر سایت پروژه',
  'site-staff': 'همکار سایت پروژه',
}

export function dashboardFilters(params: Record<string, unknown> = {}) {
  const query =
    typeof params.q === 'string' ? params.q.trim().slice(0, 120) : ''
  const status =
    typeof params.status === 'string' &&
    Object.hasOwn(projectStatusLabels, params.status)
      ? params.status
      : ''
  const rawPage =
    typeof params.page === 'string' && /^\d+$/.test(params.page)
      ? Number(params.page)
      : 1
  const page =
    Number.isSafeInteger(rawPage) && rawPage > 0 ? Math.min(rawPage, 100000) : 1
  const clauses: Where[] = []
  if (query)
    clauses.push({
      or: ['name', 'code', 'site', 'client'].map((field) => ({
        [field]: { contains: query },
      })),
    })
  if (status) clauses.push({ status: { equals: status } })
  return {
    query,
    status,
    page,
    where: clauses.length ? ({ and: clauses } as Where) : undefined,
  }
}

export function dashboardURL(query = '', status = '', page = 1) {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (status) params.set('status', status)
  if (page > 1) params.set('page', String(page))
  return `/admin${params.size ? `?${params}` : ''}`
}
