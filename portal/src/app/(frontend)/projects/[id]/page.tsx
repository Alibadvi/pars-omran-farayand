import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProjectActions } from '@/components/ProjectActions'
import { ProjectDocumentUpload } from '@/components/ProjectDocumentUpload'
import { MessageThread } from '@/components/MessageThread'
import { PortalHeader } from '@/components/PortalHeader'
import { documentCategoryLabels, emailStatusLabels, formatPortalDate, projectStatusLabels } from '@/lib/presentation'
import { canAccessProject, getPortalSession } from '@/lib/session'
import { referenceID } from '@/lib/access'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { payload, identity, user } = await getPortalSession()
  if (!/^\d+$/.test(id) || !canAccessProject(identity, id)) notFound()

  const project = await payload.findByID({ collection: 'projects', id: Number(id), depth: 0, overrideAccess: true }).catch(() => null)
  if (!project) notFound()

  const [documents, messages, emails, mailState] = await Promise.all([
    payload.find({ collection: 'project-documents', where: { project: { equals: project.id } }, depth: 0, overrideAccess: true, sort: '-createdAt', limit: 50 }),
    payload.find({ collection: 'project-messages', where: { project: { equals: project.id } }, depth: 0, overrideAccess: true, sort: '-createdAt', limit: 50 }),
    payload.find({ collection: 'external-emails', where: { project: { equals: project.id } }, depth: 0, overrideAccess: true, sort: '-occurredAt', limit: 50 }),
    payload.findGlobal({ slug: 'mail-state', overrideAccess: true }),
  ])
  const colleagues = await payload.find({ collection: 'users', depth: 0, limit: 500, overrideAccess: true, sort: 'name' })
  const authorNames = new Map(colleagues.docs.map((person) => [person.id, person.name]))
  const recipients = colleagues.docs.filter((person) => String(person.id) !== String(user.id) &&
    (person.role.startsWith('hq-') || (person.assignedProjects || []).some((assigned) => String(referenceID(assigned)) === String(project.id))))
    .map((person) => ({ id: person.id, name: person.name, role: person.role }))
  const mailConfigured = Boolean(process.env.MS_GRAPH_CLIENT_ID && process.env.MS_GRAPH_CLIENT_SECRET &&
    process.env.MS_GRAPH_MAILBOX && process.env.PORTAL_URL && /^[0-9a-f]{64}$/i.test(process.env.PORTAL_ENCRYPTION_KEY || ''))

  return <div className="shell">
    <PortalHeader name={user.name || user.username || user.email || 'همکار'} />
    <main className="container">
      <Link className="back-link" href="/">← بازگشت به همه پروژه‌ها</Link>
      <section className="project-hero"><div><p className="eyebrow"><span dir="ltr">{project.code}</span> / {project.site}</p><h1>{project.name}</h1><p>{project.summary || 'فضای مشترک دفتر مرکزی و سایت پروژه برای پیگیری کارها و مکاتبات.'}</p></div><span className={`pill pill-${project.status}`}>{projectStatusLabels[project.status] || project.status}</span></section>
      <nav className="section-nav" aria-label="بخش‌های پروژه"><a href="#documents">اسناد <span>{documents.totalDocs.toLocaleString('fa-IR')}</span></a><a href="#messages">گفتگوها <span>{messages.totalDocs.toLocaleString('fa-IR')}</span></a><a href="#emails">ایمیل‌ها <span>{emails.totalDocs.toLocaleString('fa-IR')}</span></a></nav>

      <div className="workspace-grid">
        <section className="panel" id="documents"><div className="panel-heading"><div><p className="eyebrow">آرشیو پروژه</p><h2>اسناد و فایل‌ها</h2></div><span className="panel-count">{documents.totalDocs.toLocaleString('fa-IR')} سند</span></div>
          <ProjectDocumentUpload projectId={project.id} />
          <div className="item-list">{documents.docs.map((document) => <a className="document-item" href={`/api/project-documents/file/${encodeURIComponent(document.filename || '')}`} key={document.id} download={document.filename || undefined}>
            <span className="file-icon" aria-hidden="true">↧</span><span className="item-copy"><strong>{document.title}</strong><small>{documentCategoryLabels[document.category] || document.category} · نسخه {Number(document.revision || 1).toLocaleString('fa-IR')} · <time dateTime={document.createdAt}>{formatPortalDate(document.createdAt)}</time></small></span><span className="item-arrow" aria-hidden="true">←</span>
          </a>)}{documents.docs.length === 0 && <p className="muted empty-inline">هنوز سندی ثبت نشده است. نخستین سند را از همین بخش بارگذاری کنید.</p>}</div>
          {documents.totalDocs > documents.docs.length && <Link className="archive-link" href="/admin/collections/project-documents">مشاهده همه اسناد ←</Link>}
        </section>

        <section className="panel" id="messages"><div className="panel-heading"><div><p className="eyebrow">ارتباط دفتر و سایت</p><h2>گفتگوهای داخلی</h2></div><span className="panel-count">{messages.totalDocs.toLocaleString('fa-IR')} پیام</span></div>
          <ProjectActions projectId={project.id} mode="internal" recipients={recipients} />
          <MessageThread viewerId={user.id} isAdmin={identity.role === 'hq-admin'} recipients={recipients} messages={messages.docs.map((message) => ({ id: message.id, authorId: referenceID(message.author) || 0, authorName: authorNames.get(referenceID(message.author) as number) || 'همکار پروژه', recipientId: referenceID(message.recipient) || null, recipientName: message.recipient ? authorNames.get(referenceID(message.recipient) as number) || 'همکار مشخص‌شده' : 'همه اعضای پروژه', subject: message.subject, body: message.body, createdAt: formatPortalDate(message.createdAt, true), createdISO: message.createdAt, editedAt: message.editedAt ? formatPortalDate(message.editedAt, true) : null }))} />
          {messages.totalDocs > messages.docs.length && <Link className="archive-link" href="/admin/collections/project-messages">مشاهده همه پیام‌ها ←</Link>}
        </section>
      </div>

      <section className="panel mail-panel" id="emails"><div className="panel-heading"><div><p className="eyebrow">مکاتبات بیرونی</p><h2>ایمیل‌های پروژه</h2></div><span className="panel-count">{emails.totalDocs.toLocaleString('fa-IR')} ایمیل</span></div>
        {mailConfigured && mailState.connectedAddress?.toLowerCase() === process.env.MS_GRAPH_MAILBOX?.trim().toLowerCase() ? <p className="mail-status connected"><span aria-hidden="true">●</span> حساب متصل: <b dir="ltr">{mailState.connectedAddress}</b></p> : <div className="mail-status disconnected"><strong>ارسال ایمیل هنوز فعال نیست.</strong><p>{mailConfigured ? 'مدیر دفتر تهران باید حساب Microsoft را متصل کند تا ارسال و ثبت پاسخ‌ها فعال شود.' : 'شناسه برنامه، رمز برنامه و نشانی صندوق Microsoft هنوز روی سرور تنظیم نشده‌اند. بعد از تنظیم، مدیر دفتر تهران حساب را از همین صفحه متصل می‌کند.'}</p>{mailConfigured && identity.role === 'hq-admin' && <a href="/api/portal/mail/connect">اتصال حساب Microsoft ←</a>}</div>}
        <ProjectActions projectId={project.id} mode="external" disabled={!mailConfigured || mailState.connectedAddress?.toLowerCase() !== process.env.MS_GRAPH_MAILBOX?.trim().toLowerCase()} />
        <div className="email-list">{emails.docs.map((mail) => <article className="email-item" key={mail.id}><div className="email-top"><strong>{mail.subject}</strong><span className={`pill pill-mail-${mail.status}`}>{mail.direction === 'inbound' ? 'پاسخ دریافتی' : emailStatusLabels[mail.status] || mail.status}</span></div><p className="email-address" dir="ltr">{mail.from} → {mail.to}</p><p className="email-body">{mail.body}</p><small>{mail.direction === 'outbound' && `${authorNames.get(mail.sentBy as number) || 'همکار پروژه'} · `}<time dateTime={mail.occurredAt || mail.createdAt}>{formatPortalDate(mail.occurredAt || mail.createdAt, true)}</time></small></article>)}{emails.docs.length === 0 && <p className="muted empty-inline">هنوز ایمیلی برای این پروژه ثبت نشده است.</p>}</div>
        {emails.totalDocs > emails.docs.length && <Link className="archive-link" href="/admin/collections/external-emails">مشاهده همه ایمیل‌ها ←</Link>}
      </section>
    </main>
  </div>
}
