import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload, type Payload } from 'payload'

import config from '@/payload.config'
import { type PortalIdentity, type PortalRole, referenceID } from './access'

type UserRecord = { id: number; email: string; name?: string; role: PortalRole; assignedProjects?: Array<number | string | { id: number | string }> }

export async function authenticatedSession(headers: Headers): Promise<{
  payload: Payload
  user: UserRecord
  identity: PortalIdentity
} | null> {
  const payload = await getPayload({ config })
  const auth = await payload.auth({ headers })
  if (!auth.user || auth.user.collection !== 'users') return null

  // Refresh role and project membership from PostgreSQL on every request.
  const user = await payload.findByID({ collection: 'users', id: auth.user.id, depth: 0, overrideAccess: true }) as unknown as UserRecord
  const identity: PortalIdentity = {
    id: user.id,
    role: user.role,
    assignedProjects: (user.assignedProjects ?? []).map(referenceID).filter((id): id is number | string => id !== undefined),
  }
  return { payload, user, identity }
}

export async function getPortalSession() {
  const session = await authenticatedSession(await getHeaders())
  if (!session) redirect('/admin/login')
  return session
}

export function canAccessProject(identity: PortalIdentity, id: number | string): boolean {
  return identity.role.startsWith('hq-') || identity.assignedProjects.some((item) => String(item) === String(id))
}
