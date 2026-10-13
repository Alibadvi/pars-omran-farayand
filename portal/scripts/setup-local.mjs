import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { createClient } from '@libsql/client'

const root = process.cwd()
const envFile = path.join(root, '.env.local')
const dbFile = path.join(root, '.local-data', 'portal.db')
mkdirSync(path.join(root, '.local-data', 'files'), { recursive: true })

if (!existsSync(envFile)) {
  const token = randomBytes(32).toString('hex')
  const contents = [
    '# Generated for the local preview. Never use this database for production.',
    'PORTAL_LOCAL_SQLITE=1',
    'PORTAL_URL=http://localhost:3000',
    `PAYLOAD_SECRET=${randomBytes(32).toString('hex')}`,
    `PORTAL_BOOTSTRAP_TOKEN=${token}`,
    '',
  ].join('\n')
  writeFileSync(envFile, contents, { mode: 0o600, flag: 'wx' })
  console.log('Local preview configured. Your setup token is:')
  console.log(token)
} else {
  const contents = readFileSync(envFile, 'utf8')
  if (!/^PORTAL_LOCAL_SQLITE=1$/m.test(contents) ||
    !/^PORTAL_URL=http:\/\/localhost:3000$/m.test(contents) ||
    !/^PAYLOAD_SECRET=[0-9a-f]{64}$/m.test(contents) ||
    !/^PORTAL_BOOTSTRAP_TOKEN=[0-9a-f]{64}$/m.test(contents)) {
    console.error('Existing .env.local is not a local preview configuration. Move it aside before running dev:local.')
    process.exit(1)
  }
  console.log('Local preview setup token:')
  console.log(contents.match(/^PORTAL_BOOTSTRAP_TOKEN=([0-9a-f]{64})$/m)[1])
}

// Payload's SQLite dev schema push may rebuild a table by selecting every new
// column from the old table. Add nullable columns first so existing users and
// messages survive the switch to username login and message recipients.
if (existsSync(dbFile)) {
  const db = createClient({ url: `file:${dbFile}` })
  try {
    const users = (await db.execute('PRAGMA table_info("users")')).rows.map((column) => column.name)
    const messages = (await db.execute('PRAGMA table_info("project_messages")')).rows.map((column) => column.name)
    const changes = []
    if (users.length && !users.includes('username')) changes.push('ALTER TABLE "users" ADD COLUMN "username" TEXT')
    if (messages.length && !messages.includes('recipient_id')) changes.push('ALTER TABLE "project_messages" ADD COLUMN "recipient_id" INTEGER')
    if (messages.length && !messages.includes('edited_at')) changes.push('ALTER TABLE "project_messages" ADD COLUMN "edited_at" TEXT')

    if (changes.length) {
      const backup = `${dbFile}.before-username-${new Date().toISOString().replace(/[:.]/g, '-')}.bak`
      await db.execute({ sql: 'VACUUM INTO ?', args: [backup] })
      const tx = await db.transaction('write')
      try {
        for (const change of changes) await tx.execute(change)
        await tx.commit()
      } catch (error) {
        await tx.rollback()
        throw error
      }
      console.log(`Local preview database updated without removing records. Backup: ${backup}`)
    }
  } finally {
    db.close()
  }
}

console.log('Open http://localhost:3000/setup to create the first administrator.')
