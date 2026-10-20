import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { after, before, test } from 'node:test'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import {
  buildConfig,
  createLocalReq,
  getPayload,
  type Payload,
  type PayloadRequest,
} from 'payload'

import { Users } from '../src/collections/Users'
import { Projects } from '../src/collections/Projects'
import { ProjectDocuments } from '../src/collections/ProjectDocuments'
import { ProjectMessages } from '../src/collections/ProjectMessages'
import { ExternalEmails } from '../src/collections/ExternalEmails'
import { dashboardFilters, dashboardURL } from '../src/lib/admin'
import { referenceID, type PortalRole } from '../src/lib/access'
import { formatPortalDate } from '../src/lib/presentation'

type Account = NonNullable<PayloadRequest['user']>
let payload: Payload
let directory: string
let admin: Account
let office: Account
let site: Account
let other: Account
let unassigned: Account
let alpha: number
let beta: number
const asUser = async (user: Account) => ({
  overrideAccess: false as const,
  req: await createLocalReq({ user }, payload),
})

before(async () => {
  directory = await mkdtemp(path.join(os.tmpdir(), 'pof-admin-test-'))
  const config = buildConfig({
    secret: randomBytes(32).toString('hex'),
    collections: [
      Users,
      Projects,
      {
        ...ProjectDocuments,
        upload: {
          ...(typeof ProjectDocuments.upload === 'object'
            ? ProjectDocuments.upload
            : {}),
          staticDir: path.join(directory, 'uploads'),
        },
      },
      ProjectMessages,
      ExternalEmails,
    ],
    db: sqliteAdapter({
      client: { url: `file:${path.join(directory, 'test.db')}` },
    }),
    typescript: { autoGenerate: false },
  })
  payload = await getPayload({ config })
  const addUser = async (
    email: string,
    role: PortalRole,
    assignedProjects: number[] = [],
  ) =>
    ({
      ...(await payload.create({
        collection: 'users',
        data: {
          email,
          name: email.split('@')[0],
          password: randomBytes(24).toString('hex'),
          role,
          assignedProjects,
        },
      })),
      collection: 'users',
    }) as Account
  admin = await addUser('admin@example.test', 'hq-admin')
  alpha = (
    await payload.create({
      collection: 'projects',
      data: {
        code: 'ALPHA',
        name: 'پروژه آلفا',
        site: 'تهران',
        client: 'کارفرمای اول',
        status: 'active',
      },
    })
  ).id
  beta = (
    await payload.create({
      collection: 'projects',
      data: {
        code: 'BETA',
        name: 'پروژه بتا',
        site: 'شیراز',
        status: 'planning',
      },
    })
  ).id
  office = await addUser('office@example.test', 'hq-staff')
  site = await addUser('site@example.test', 'site-staff', [alpha])
  other = await addUser('other@example.test', 'site-manager', [beta])
  unassigned = await addUser('unassigned@example.test', 'site-staff')
})

after(async () => {
  if (payload) await payload.destroy()
  if (directory) await rm(directory, { recursive: true, force: true })
})

test('dashboard project queries and counts respect current assignments for every role', async () => {
  for (const [user, expected] of [
    [admin, 2],
    [office, 2],
    [site, 1],
    [other, 1],
    [unassigned, 0],
  ] as const) {
    const options = await asUser(user)
    const found = await payload.find({
      ...options,
      collection: 'projects',
      depth: 0,
    })
    const count = await payload.count({ ...options, collection: 'projects' })
    assert.equal(found.totalDocs, expected)
    assert.equal(count.totalDocs, expected)
  }
  await assert.rejects(
    payload.count({ collection: 'projects', overrideAccess: false }),
  )
  const options = await asUser(site)
  assert.equal(
    (
      await payload.find({
        ...options,
        collection: 'projects',
        where: dashboardFilters({ q: 'کارفرمای اول' }).where,
      })
    ).totalDocs,
    1,
  )
  assert.equal(
    (
      await payload.find({
        ...options,
        collection: 'projects',
        where: dashboardFilters({ status: 'planning' }).where,
      })
    ).totalDocs,
    0,
  )
  assert.equal(
    (
      await payload.find({
        ...options,
        collection: 'projects',
        where: dashboardFilters({ q: 'BETA' }).where,
      })
    ).totalDocs,
    0,
  )
})

test('a stale role or assignment in the login token cannot retain old privileges', async () => {
  const options = await asUser({
    ...site,
    role: 'hq-admin',
    assignedProjects: [alpha, beta],
  })
  assert.equal(
    (await payload.count({ ...options, collection: 'projects' })).totalDocs,
    1,
  )
  await assert.rejects(
    payload.create({
      ...options,
      collection: 'projects',
      data: {
        code: 'DENIED',
        name: 'Denied',
        site: 'Test',
        status: 'planning' as const,
      },
    }),
  )
  await payload.update({
    collection: 'users',
    id: site.id,
    data: { assignedProjects: [] },
  })
  assert.equal(
    (await payload.count({ ...(await asUser(site)), collection: 'projects' }))
      .totalDocs,
    0,
  )
  await payload.update({
    collection: 'users',
    id: site.id,
    data: { assignedProjects: [alpha] },
  })
})

test('project forms reject whitespace and excessive lengths, trim inputs, and preserve uniqueness', async () => {
  const options = await asUser(admin)
  for (const data of [
    { code: '   ', name: 'Test', site: 'Test', status: 'planning' as const },
    { code: 'SPACE', name: '   ', site: 'Test', status: 'planning' as const },
    {
      code: 'LONG',
      name: 'x'.repeat(181),
      site: 'Test',
      status: 'planning' as const,
    },
  ]) {
    await assert.rejects(
      payload.create({ ...options, collection: 'projects', data }),
    )
  }
  const project = await payload.create({
    ...options,
    collection: 'projects',
    data: {
      code: '  TRIM  ',
      name: '  نام پروژه  ',
      site: '  تهران  ',
      status: 'planning' as const,
    },
  })
  assert.equal(project.code, 'TRIM')
  assert.equal(project.name, 'نام پروژه')
  await assert.rejects(
    payload.create({
      ...options,
      collection: 'projects',
      data: {
        code: ' TRIM ',
        name: 'Duplicate',
        site: 'Test',
        status: 'planning' as const,
      },
    }),
  )
  await payload.delete({ ...options, collection: 'projects', id: project.id })
})

test('login identity is required, while username-only accounts remain supported', async () => {
  const options = await asUser(admin)
  await assert.rejects(
    payload.create({
      ...options,
      collection: 'users',
      data: {
        name: 'No login',
        role: 'site-staff',
        password: 'test-password-not-production',
      },
    }),
  )
  const user = await payload.create({
    ...options,
    collection: 'users',
    data: {
      name: 'Username account',
      username: '  colleague-only  ',
      role: 'site-staff',
      password: 'test-password-not-production',
    },
  })
  assert.equal(user.username, 'colleague-only')
  const edited = await payload.update({
    ...options,
    collection: 'users',
    id: user.id,
    data: { name: 'Changed name' },
  })
  assert.equal(edited.username, 'colleague-only')
  await assert.rejects(
    payload.update({
      ...options,
      collection: 'users',
      id: user.id,
      data: { username: null, email: null },
    }),
  )
  await payload.delete({ ...options, collection: 'users', id: user.id })
})

test('administrators cannot delete or demote their currently signed-in account', async () => {
  const options = await asUser(admin)
  await assert.rejects(
    payload.delete({ ...options, collection: 'users', id: admin.id }),
    /حسابی/,
  )
  await assert.rejects(
    payload.update({
      ...options,
      collection: 'users',
      id: admin.id,
      data: { role: 'site-staff' },
    }),
  )
  assert.equal(
    (await payload.findByID({ collection: 'users', id: admin.id })).role,
    'hq-admin',
  )
})

test('messages validate project membership, recipient, content, authorship, and edit permissions', async () => {
  const options = await asUser(site)
  await assert.rejects(
    payload.create({
      ...options,
      collection: 'project-messages',
      data: { project: beta, subject: 'Denied', body: 'Body', author: site.id },
    }),
  )
  await assert.rejects(
    payload.create({
      ...options,
      collection: 'project-messages',
      data: {
        project: alpha,
        subject: 'Wrong recipient',
        body: 'Body',
        author: site.id,
        recipient: other.id,
      },
    }),
  )
  await assert.rejects(
    payload.create({
      ...options,
      collection: 'project-messages',
      data: { project: alpha, subject: 'Empty', body: '  ', author: site.id },
    }),
  )
  const message = await payload.create({
    ...options,
    collection: 'project-messages',
    data: {
      project: alpha,
      subject: '  گزارش روزانه  ',
      body: '  متن گزارش  ',
      author: admin.id,
    },
  })
  assert.equal(referenceID(message.author), site.id)
  assert.equal(message.body, 'متن گزارش')
  const directed = await payload.create({
    ...options,
    collection: 'project-messages',
    data: {
      project: alpha,
      subject: 'برای دفتر',
      body: 'هماهنگی پروژه',
      author: site.id,
      recipient: admin.id,
    },
  })
  assert.equal(referenceID(directed.recipient), admin.id)
  await payload.delete({
    ...options,
    collection: 'project-messages',
    id: directed.id,
  })
  const edited = await payload.update({
    ...options,
    collection: 'project-messages',
    id: message.id,
    data: { body: 'گزارش اصلاح‌شده' },
  })
  assert.ok(edited.editedAt)
  assert.equal(referenceID(edited.author), site.id)
  await assert.rejects(
    payload.update({
      ...(await asUser(office)),
      collection: 'project-messages',
      id: message.id,
      data: { body: 'Someone else' },
    }),
  )
  await assert.rejects(
    payload.update({
      ...options,
      collection: 'project-messages',
      id: message.id,
      data: { author: admin.id },
    }),
  )
  await assert.rejects(
    payload.update({
      ...options,
      collection: 'project-messages',
      id: message.id,
      data: { project: beta },
    }),
  )
  assert.equal(
    (
      await payload.count({
        ...(await asUser(other)),
        collection: 'project-messages',
      })
    ).totalDocs,
    0,
  )
  assert.equal(
    (
      await payload.count({
        ...(await asUser(unassigned)),
        collection: 'project-messages',
      })
    ).totalDocs,
    0,
  )
  await assert.rejects(
    payload.delete({
      ...(await asUser(admin)),
      collection: 'users',
      id: site.id,
    }),
    /سوابق/,
  )
  await payload.delete({
    ...options,
    collection: 'project-messages',
    id: message.id,
  })
})

test('project deletion preserves assignments and project archives', async () => {
  const options = await asUser(admin)
  await assert.rejects(
    payload.delete({ ...options, collection: 'projects', id: alpha }),
    /سوابق/,
  )
  const project = await payload.create({
    ...options,
    collection: 'projects',
    data: {
      code: 'ARCHIVE',
      name: 'Archive project',
      site: 'Test',
      status: 'planning' as const,
    },
  })
  await payload.create({
    ...options,
    collection: 'project-messages',
    data: {
      project: project.id,
      subject: 'Keep this record',
      body: 'Project history',
      author: admin.id,
    },
  })
  await assert.rejects(
    payload.delete({ ...options, collection: 'projects', id: project.id }),
    /سوابق/,
  )
  const archived = await payload.update({
    ...options,
    collection: 'projects',
    id: project.id,
    data: { status: 'completed' },
  })
  assert.equal(archived.status, 'completed')
})

test('document revisions cannot reference another project and keep immutable archive records', async () => {
  const options = await asUser(site)
  const image = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=',
    'base64',
  )
  const file = {
    data: image,
    mimetype: 'image/png',
    name: 'sample.png',
    size: image.length,
  }
  const original = await payload.create({
    ...options,
    collection: 'project-documents',
    data: {
      project: alpha,
      title: '  نقشه اولیه  ',
      category: 'drawing',
      revision: 1,
    },
    file,
  })
  assert.equal(original.title, 'نقشه اولیه')
  assert.equal(referenceID(original.uploadedBy), site.id)
  const revision = await payload.create({
    ...options,
    collection: 'project-documents',
    data: {
      project: alpha,
      title: 'Updated drawing',
      category: 'drawing',
      supersedes: original.id,
      revision: 999,
    },
    file: { ...file, name: 'revision.png' },
  })
  assert.equal(revision.revision, 2)
  await assert.rejects(
    payload.create({
      ...(await asUser(admin)),
      collection: 'project-documents',
      data: {
        project: beta,
        title: 'Wrong project',
        category: 'drawing',
        revision: 1,
        supersedes: original.id,
      },
      file: { ...file, name: 'wrong.png' },
    }),
  )
  await assert.rejects(
    payload.update({
      ...(await asUser(admin)),
      collection: 'project-documents',
      id: original.id,
      data: { title: 'Changed' },
    }),
  )
  await assert.rejects(
    payload.delete({
      ...(await asUser(admin)),
      collection: 'project-documents',
      id: original.id,
    }),
  )
  assert.equal(
    (
      await payload.count({
        ...(await asUser(other)),
        collection: 'project-documents',
      })
    ).totalDocs,
    0,
  )
})

test('dashboard query parsing rejects malformed input and keeps filters through pagination', () => {
  assert.deepEqual(
    dashboardFilters({ q: ['bad'], status: '__proto__', page: '-1' }),
    { query: '', status: '', page: 1, where: undefined },
  )
  assert.equal(dashboardFilters({ page: '999999999999999999999' }).page, 1)
  assert.equal(dashboardFilters({ page: '999999' }).page, 100000)
  assert.equal(dashboardFilters({ q: 'x'.repeat(500) }).query.length, 120)
  const url = new URL(
    dashboardURL('پروژه & یک', 'on-hold', 2),
    'http://localhost',
  )
  assert.equal(url.searchParams.get('q'), 'پروژه & یک')
  assert.equal(url.searchParams.get('status'), 'on-hold')
  assert.equal(url.searchParams.get('page'), '2')
})

test('Persian dates are rendered in Tehran time regardless of the server timezone', () => {
  assert.equal(formatPortalDate('invalid'), '—')
  const script =
    "import { formatPortalDate } from './src/lib/presentation.ts'; console.log(formatPortalDate('2026-10-20T21:30:00Z', true))"
  const utc = execFileSync(
    process.execPath,
    ['--import', 'tsx', '--input-type=module', '-e', script],
    { env: { ...process.env, TZ: 'UTC' }, encoding: 'utf8' },
  )
  const pacific = execFileSync(
    process.execPath,
    ['--import', 'tsx', '--input-type=module', '-e', script],
    { env: { ...process.env, TZ: 'America/Los_Angeles' }, encoding: 'utf8' },
  )
  assert.equal(utc, pacific)
})
