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
const postgresPool = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.PGHOST || '127.0.0.1',
      port: Number(process.env.PGPORT || 5432),
      database: process.env.PGDATABASE || '',
      user: process.env.PGUSER || '',
      password: process.env.PGPASSWORD || '',
    }

export default buildConfig({
  admin: { user: Users.slug, avatar: 'default', importMap: { baseDir: dirname }, components: {
    graphics: { Logo: './components/AdminLogo#AdminLogo', Icon: './components/AdminLogo#AdminIcon' },
    views: { dashboard: { Component: './components/AdminDashboard#AdminDashboard' } },
    afterNavLinks: ['./components/AdminWorkspaceLink#AdminWorkspaceLink'],
  } },
  collections: [Users, Projects, ProjectDocuments, ProjectMessages, ExternalEmails],
  globals: [MailState],
  editor: lexicalEditor(),
  i18n: { fallbackLanguage: 'fa', supportedLanguages: { fa } },
  secret: process.env.PAYLOAD_SECRET || '',
  db: localSQLite ? sqliteAdapter({
    client: { url: `file:${path.resolve(process.cwd(), '.local-data/portal.db')}` },
  }) : postgresAdapter({
    pool: postgresPool,
    disableCreateDatabase: true,
    prodMigrations: migrations,
  }),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  cors: [process.env.PORTAL_URL || 'http://localhost:3000'],
  csrf: [process.env.PORTAL_URL || 'http://localhost:3000'],
})
