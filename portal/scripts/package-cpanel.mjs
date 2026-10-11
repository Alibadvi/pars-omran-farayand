import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const standalone = path.join(root, '.next/standalone')
const stage = path.join(root, '.release-stage')

if (!fs.existsSync(path.join(standalone, 'server.js')) || !fs.existsSync(path.join(root, '.next/static'))) {
  throw new Error('Run npm run build before packaging the cPanel release.')
}

fs.rmSync(stage, { recursive: true, force: true })
fs.mkdirSync(stage)
fs.cpSync(standalone, stage, { recursive: true })
fs.mkdirSync(path.join(stage, '.next'), { recursive: true })
fs.cpSync(path.join(root, '.next/static'), path.join(stage, '.next/static'), { recursive: true })
fs.cpSync(path.join(root, 'public'), path.join(stage, 'public'), { recursive: true })
fs.copyFileSync(path.join(root, 'app.cjs'), path.join(stage, 'app.cjs'))

for (const name of ['.env', '.env.local', 'private-files']) {
  if (fs.existsSync(path.join(stage, name))) throw new Error(`Refusing to include ${name} in the deployment archive.`)
}

console.log('Standalone release staged for archiving.')
