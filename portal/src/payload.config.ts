import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fa } from '@payloadcms/translations/languages/fa'
import path from 'node:path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'node:url'

import { ExternalEmails } from './collections/ExternalEmails'
import { ProjectDocuments } from './collections/ProjectDocuments'
import { ProjectMessages } from './collections/ProjectMessages'
import { Projects } from './collections/Projects'
import { Users } from './collections/Users'
import { MailState } from './globals/MailState'
import { migrations } from './migrations'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const localSQLite = process.env.NODE_ENV !== 'production' && process.env.PORTAL_LOCAL_SQLITE === '1'

export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: dirname } },
  collections: [Users, Projects, ProjectDocuments, ProjectMessages, ExternalEmails],
  globals: [MailState],
  editor: lexicalEditor(),
  i18n: { fallbackLanguage: 'fa', supportedLanguages: { fa } },
  secret: process.env.PAYLOAD_SECRET || '',
  db: localSQLite ? sqliteAdapter({
    client: { url: `file:${path.resolve(process.cwd(), '.local-data/portal.db')}` },
  }) : postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    disableCreateDatabase: true,
    prodMigrations: migrations,
  }),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  cors: [process.env.PORTAL_URL || 'http://localhost:3000'],
  csrf: [process.env.PORTAL_URL || 'http://localhost:3000'],
})
