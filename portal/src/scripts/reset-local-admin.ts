import { getPayload } from 'payload'

import config from '../payload.config'

if (process.env.NODE_ENV === 'production' || process.env.PORTAL_LOCAL_SQLITE !== '1') {
  throw new Error('This command works only with the local SQLite preview.')
}

const email = process.env.RESET_ADMIN_EMAIL?.trim().toLowerCase()
const password = process.env.RESET_ADMIN_PASSWORD || ''
if (!email || password.length < 16) throw new Error('Set RESET_ADMIN_EMAIL and a new RESET_ADMIN_PASSWORD of at least 16 characters.')

const payload = await getPayload({ config })
try {
  const found = await payload.find({ collection: 'users', where: { email: { equals: email } }, depth: 0, limit: 1, overrideAccess: true })
  const user = found.docs[0]
  if (!user || user.role !== 'hq-admin') throw new Error('No Tehran administrator exists with that email in this local preview.')
  await payload.update({ collection: 'users', id: user.id, overrideAccess: true,
    data: { password, loginAttempts: 0, lockUntil: null } })
  console.log('Local administrator password reset and account unlocked. Sign in at http://localhost:3000/admin/login')
} finally {
  await payload.db.destroy?.()
}
