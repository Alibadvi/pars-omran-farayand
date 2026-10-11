import type { PayloadRequest, Where } from 'payload'

export type PortalRole = 'hq-admin' | 'hq-staff' | 'site-manager' | 'site-staff'

export type PortalIdentity = {
  id: number | string
  role: PortalRole
  assignedProjects: Array<number | string>
}

type Reference = number | string | { id: number | string }

export const referenceID = (value: Reference | null | undefined): number | string | undefined => {
  if (value == null) return undefined
  return typeof value === 'object' ? value.id : value
}

/** Read the current role and assignments from the database, never from a stale login token. */
export async function portalIdentity(req: PayloadRequest): Promise<PortalIdentity | null> {
  if (!req.user || req.user.collection !== 'users') return null

  const user = await req.payload.findByID({
    collection: 'users',
    id: req.user.id,
    depth: 0,
    overrideAccess: true,
    req,
  })

  if (!user) return null
  const assignedProjects = (user as unknown as { assignedProjects?: Reference[] }).assignedProjects ?? []
  return {
    id: user.id,
    role: (user as unknown as { role: PortalRole }).role,
    assignedProjects: assignedProjects
      .map((value) => referenceID(value as Reference))
      .filter((value): value is number | string => value !== undefined),
  }
}

export const isHeadOffice = (identity: PortalIdentity | null): boolean =>
  identity?.role === 'hq-admin' || identity?.role === 'hq-staff'

export async function accessibleProjects(req: PayloadRequest): Promise<boolean | Where> {
  const identity = await portalIdentity(req)
  if (!identity) return false
  if (isHeadOffice(identity)) return true
  return { id: { in: identity.assignedProjects } }
}

export async function projectRecordAccess(req: PayloadRequest): Promise<boolean | Where> {
  const identity = await portalIdentity(req)
  if (!identity) return false
  if (isHeadOffice(identity)) return true
  return { project: { in: identity.assignedProjects } }
}

export async function requireProjectAccess(
  req: PayloadRequest,
  project: Reference | null | undefined,
): Promise<number | string> {
  const identity = await portalIdentity(req)
  const id = referenceID(project)
  if (!identity || id === undefined) throw new Error('A permitted project is required.')

  if (!isHeadOffice(identity) && !identity.assignedProjects.some((item) => String(item) === String(id))) {
    throw new Error('You do not have access to this project.')
  }

  // An assignment to a removed project must not authorize writing to a ghost ID.
  await req.payload.findByID({ collection: 'projects', id, depth: 0, overrideAccess: true, req })
  return id
}
