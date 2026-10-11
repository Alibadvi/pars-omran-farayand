import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const envFile = path.join(root, '.env.local')
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

console.log('Open http://localhost:3000/setup to create the first administrator.')
