import Link from 'next/link'
import type { Where } from 'payload'

import { PortalHeader } from '@/components/PortalHeader'
import { ProjectDirectory } from '@/components/ProjectDirectory'
import { formatPortalDate } from '@/lib/presentation'
import { getPortalSession } from '@/lib/session'

export default async function HomePage() {
  const { payload, identity, user } = await getPortalSession()
  const where: Where = identity.role.startsWith('hq-') ? {} : { id: { in: identity.assignedProjects } }
  const [projects, active] = await Promise.all([
    payload.find({ collection: 'projects', depth: 0, limit: 100, sort: '-updatedAt', overrideAccess: true, where }),
    payload.count({ collection: 'projects', overrideAccess: true, where: { and: [where, { status: { equals: 'active' } }] } }),
  ])

  return <div className="shell">
    <PortalHeader name={user.name || user.username || user.email || 'همکار'} />
    <main className="container">
      <section className="dashboard-hero">
        <div className="hero-copy"><p className="eyebrow">پارس عمران فرآیند / فضای کاری داخلی</p><h1>مرکز پروژه‌ها</h1><p>اسناد، گفتگوهای دفتر تهران و سایت‌های پروژه، و مکاتبات بیرونی را در فضای هر پروژه پیگیری کنید.</p>
          {identity.role === 'hq-admin' && <Link className="button button-gold" href="/admin/collections/projects/create">ایجاد پروژه جدید <span aria-hidden="true">←</span></Link>}
        </div>
        <div className="hero-stats" aria-label="نمای کلی پروژه‌ها"><div><strong>{projects.totalDocs.toLocaleString('fa-IR')}</strong><span>کل پروژه‌های قابل مشاهده</span></div><div><strong>{active.totalDocs.toLocaleString('fa-IR')}</strong><span>پروژه در حال اجرا</span></div></div>
      </section>
      <ProjectDirectory total={projects.totalDocs} projects={projects.docs.map((project) => ({ id: project.id, code: project.code, name: project.name, site: project.site, status: project.status, updated: formatPortalDate(project.updatedAt) }))} />
    </main>
  </div>
}
