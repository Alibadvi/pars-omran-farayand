import Link from 'next/link'
import Image from 'next/image'

import { getPortalSession } from '@/lib/session'

export default async function HomePage() {
  const { payload, identity, user } = await getPortalSession()
  const projects = await payload.find({
    collection: 'projects', depth: 0, limit: 100, sort: '-updatedAt', overrideAccess: true,
    where: identity.role.startsWith('hq-') ? {} : { id: { in: identity.assignedProjects } },
  })

  return <div className="shell">
    <header className="topbar"><div><span className="brand-mark"><Image alt="نشان پارس عمران فرآیند" src="/logo.webp" width={34} height={34} /></span><strong>پرتال پروژه‌های پارس عمران فرآیند</strong></div><nav><span>{user.name || user.email}</span><Link href="/admin">مدیریت</Link><Link href="/admin/logout">خروج</Link></nav></header>
    <main className="container">
      <p className="eyebrow">دفتر مرکزی / سایت‌های پروژه</p><h1>پروژه‌ها</h1>
      <p className="lede">اسناد، گفتگوهای داخلی و مکاتبات بیرونی هر پروژه در یک محل نگهداری می‌شوند.</p>
      <div className="project-grid">{projects.docs.map((project) => <Link className="project-card" href={`/projects/${project.id}`} key={project.id}>
        <div className="card-top"><span>{project.code}</span><span className="pill">{project.status}</span></div><h2>{project.name}</h2><p>{project.site}</p><span className="card-link">ورود به پروژه ←</span>
      </Link>)}</div>
      {projects.docs.length === 0 && <div className="empty">هنوز پروژه‌ای برای حساب شما ثبت نشده است.</div>}
      {identity.role === 'hq-admin' && <p className="manage-link"><Link href="/admin/collections/projects/create">ایجاد پروژه جدید ←</Link></p>}
    </main>
  </div>
}
