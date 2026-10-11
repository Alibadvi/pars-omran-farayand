import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { ProjectActions } from '@/components/ProjectActions'
import { canAccessProject, getPortalSession } from '@/lib/session'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { payload, identity } = await getPortalSession()
  if (!/^\d+$/.test(id) || !canAccessProject(identity, id)) notFound()

  const project = await payload.findByID({ collection: 'projects', id: Number(id), depth: 0, overrideAccess: true }).catch(() => null)
  if (!project) notFound()

  const [documents, messages, emails, mailState] = await Promise.all([
    payload.find({ collection: 'project-documents', where: { project: { equals: project.id } }, depth: 0, overrideAccess: true, sort: '-createdAt', limit: 50 }),
    payload.find({ collection: 'project-messages', where: { project: { equals: project.id } }, depth: 0, overrideAccess: true, sort: '-createdAt', limit: 50 }),
    payload.find({ collection: 'external-emails', where: { project: { equals: project.id } }, depth: 0, overrideAccess: true, sort: '-occurredAt', limit: 50 }),
    payload.findGlobal({ slug: 'mail-state', overrideAccess: true }),
  ])
  const authorIDs = [...new Set([...messages.docs.map((message) => message.author), ...emails.docs.map((mail) => mail.sentBy)].filter((value): value is number => typeof value === 'number'))]
  const authors = authorIDs.length ? await payload.find({ collection: 'users', where: { id: { in: authorIDs } }, depth: 0, limit: 100, overrideAccess: true }) : { docs: [] }
  const authorNames = new Map(authors.docs.map((person) => [person.id, person.name]))

  return <div className="shell">
    <header className="topbar"><Link className="brand-mark" href="/"><Image alt="نشان پارس عمران فرآیند" src="/logo.webp" width={34} height={34} /></Link><nav><Link href="/">همه پروژه‌ها</Link><Link href="/admin/logout">خروج</Link></nav></header>
    <main className="container">
      <Link className="back" href="/">← بازگشت به پروژه‌ها</Link>
      <div className="project-heading"><div><p className="eyebrow">{project.code} · {project.site}</p><h1>{project.name}</h1><p className="lede">{project.summary || 'فضای مشترک دفتر مرکزی و سایت پروژه'}</p></div><span className="pill">{project.status}</span></div>
      <div className="workspace-grid">
        <section className="panel"><div className="panel-heading"><div><p className="eyebrow">فایل‌ها</p><h2>اسناد پروژه</h2></div><Link href="/admin/collections/project-documents/create">بارگذاری سند ←</Link></div>
          {documents.docs.map((document) => <a className="item" href={`/api/project-documents/file/${encodeURIComponent(document.filename || '')}`} key={document.id}><strong>{document.title}</strong><span>{document.category} · {new Date(document.createdAt).toLocaleDateString('fa-IR')}</span></a>)}
          {documents.docs.length === 0 && <p className="muted">هنوز سندی ثبت نشده است.</p>}
        </section>
        <section className="panel"><div className="panel-heading"><div><p className="eyebrow">داخل شرکت</p><h2>گفتگوهای پروژه</h2></div><Link href="/admin/collections/project-messages">آرشیو گفتگوها ←</Link></div>
          <ProjectActions projectId={project.id} mode="internal" />
          {messages.docs.map((message) => <article className="item" key={message.id}><strong>{authorNames.get(message.author as number) || 'همکار پروژه'}</strong><p>{message.body}</p><span>{new Date(message.createdAt).toLocaleString('fa-IR')}</span></article>)}
          {messages.docs.length === 0 && <p className="muted">هنوز گفتگویی ثبت نشده است.</p>}
        </section>
      </div>
      <section className="panel mail-panel"><div className="panel-heading"><div><p className="eyebrow">بیرون از شرکت</p><h2>ایمیل‌های پروژه</h2></div><Link href="/admin/collections/external-emails">آرشیو ایمیل‌ها ←</Link></div>
        <p className="muted">ارسال از {mailState.connectedAddress || 'ایمیل مشترک دفتر مرکزی'}</p>
        {!mailState.connectedAddress && identity.role === 'hq-admin' && <a className="connect-mail" href="/api/portal/mail/connect">اتصال حساب Outlook توسط مدیر تهران ←</a>}
        <ProjectActions projectId={project.id} mode="external" disabled={!mailState.connectedAddress} />
        {emails.docs.map((mail) => <article className="item" key={mail.id}><div className="email-top"><strong>{mail.subject}</strong><span className="pill">{mail.direction === 'inbound' ? 'پاسخ دریافتی' : mail.status === 'accepted' ? 'پذیرفته‌شده برای ارسال' : mail.status}</span></div><span className="email-address">{mail.from} ← {mail.to}</span><p>{mail.body}</p><span>{mail.direction === 'outbound' && `${authorNames.get(mail.sentBy as number) || 'همکار پروژه'} · `}{new Date(mail.occurredAt || mail.createdAt).toLocaleString('fa-IR')}</span></article>)}
        {emails.docs.length === 0 && <p className="muted">هنوز ایمیلی به این پروژه متصل نشده است.</p>}
      </section>
    </main>
  </div>
}
