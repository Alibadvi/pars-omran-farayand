import { getPayload } from 'payload'

import config from '../payload.config'

const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase()
const password = process.env.BOOTSTRAP_ADMIN_PASSWORD
const name = process.env.BOOTSTRAP_ADMIN_NAME?.trim() || 'Tehran administrator'

if (!email || !password || password.length < 16) throw new Error('Supply BOOTSTRAP_ADMIN_EMAIL and a 16+ character BOOTSTRAP_ADMIN_PASSWORD.')
const payload = await getPayload({ config })
const existing = await payload.find({ collection: 'users', limit: 1, overrideAccess: true })
if (existing.totalDocs !== 0) throw new Error('Users already exist. Bootstrap is disabled; use a Tehran administrator account.')

await payload.create({ collection: 'users', overrideAccess: true, data: { email, password, name, role: 'hq-admin', assignedProjects: [] } })
console.log(`Created first Tehran administrator: ${email}`)
await payload.db.destroy?.()
