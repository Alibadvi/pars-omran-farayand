import { Gutter } from '@payloadcms/ui'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { AdminViewServerProps } from 'payload'

import { portalIdentity } from '../lib/access'
import { dashboardFilters, dashboardURL } from '../lib/admin'
import { formatPortalDate, projectStatusLabels } from '../lib/presentation'
import { AdminGlyph } from './AdminGlyph'
import { AdminWelcome } from './AdminWelcome'

const number = (value: number) => value.toLocaleString('fa-IR')

export async function AdminDashboard({
  initPageResult,
  searchParams,
}: AdminViewServerProps) {
  const { req } = initPageResult
  const identity = await portalIdentity(req)
  if (!identity) redirect('/admin/login')
  const { payload } = req
  const isAdmin = identity.role === 'hq-admin'
  const filters = dashboardFilters(searchParams)
  const shared = { overrideAccess: false as const, req }

  // Every query uses collection access controls, including counts and activity.
  const [
    total,
    active,
    documents,
    messages,
    emails,
    colleagues,
    projects,
    recentMessages,
    recentDocuments,
  ] = await Promise.all([
    payload.count({ ...shared, collection: 'projects' }),
    payload.count({
      ...shared,
      collection: 'projects',
      where: { status: { equals: 'active' } },
    }),
    payload.count({ ...shared, collection: 'project-documents' }),
    payload.count({ ...shared, collection: 'project-messages' }),
    payload.count({ ...shared, collection: 'external-emails' }),
    isAdmin
      ? payload.count({ ...shared, collection: 'users' })
      : Promise.resolve(null),
    payload.find({
      ...shared,
      collection: 'projects',
      where: filters.where,
      page: filters.page,
      limit: 8,
      depth: 0,
      sort: '-updatedAt',
    }),
    payload.find({
      ...shared,
      collection: 'project-messages',
      limit: 4,
      depth: 0,
      sort: '-createdAt',
    }),
    payload.find({
      ...shared,
      collection: 'project-documents',
      limit: 4,
      depth: 0,
      sort: '-createdAt',
    }),
  ])

  // Deleted items and old bookmarks must not leave an empty out-of-range page.
  if (filters.page > projects.totalPages && filters.page > 1) {
    redirect(
      dashboardURL(
        filters.query,
        filters.status,
        Math.max(1, projects.totalPages),
      ),
    )
  }

  const stats = [
    {
      label: 'کل پروژه‌ها',
      value: total.totalDocs,
      detail: 'پروژه‌های قابل دسترس',
      icon: 'projects' as const,
      href: '/admin/collections/projects',
    },
    {
      label: 'در حال اجرا',
      value: active.totalDocs,
      detail: 'پروژه‌های فعال',
      icon: 'activity' as const,
      href: dashboardURL('', 'active'),
    },
    {
      label: 'اسناد پروژه',
      value: documents.totalDocs,
      detail: 'فایل‌های ثبت‌شده',
      icon: 'file' as const,
      href: '/admin/collections/project-documents',
    },
    {
      label: 'گفتگوهای داخلی',
      value: messages.totalDocs,
      detail: 'پیام‌های ثبت‌شده',
      icon: 'message' as const,
      href: '/admin/collections/project-messages',
    },
  ]
  const shortcuts = [
    ...(isAdmin
      ? [
          {
            title: 'افزودن همکار',
            detail: `${number(colleagues?.totalDocs || 0)} همکار · مدیریت نقش و پروژه‌ها`,
            href: '/admin/collections/users/create',
            icon: 'people' as const,
          },
        ]
      : []),
    {
      title: 'بارگذاری سند',
      detail: 'انتخاب پروژه و ثبت فایل جدید',
      href: '/admin/collections/project-documents/create',
      icon: 'file' as const,
    },
    {
      title: 'ارسال پیام داخلی',
      detail: 'هماهنگی با اعضای پروژه',
      href: '/admin/collections/project-messages/create',
      icon: 'message' as const,
    },
    {
      title: 'آرشیو ایمیل‌ها',
      detail: `${number(emails.totalDocs)} مکاتبه · ارسال از فضای پروژه`,
      href: '/admin/collections/external-emails',
      icon: 'mail' as const,
    },
  ]
  const activity = [
    ...recentMessages.docs.map((item) => ({
      id: `message-${item.id}`,
      title: item.subject,
      date: item.createdAt,
      label: 'پیام داخلی',
      icon: 'message' as const,
      href: `/admin/collections/project-messages/${item.id}`,
    })),
    ...recentDocuments.docs.map((item) => ({
      id: `document-${item.id}`,
      title: item.title,
      date: item.createdAt,
      label: 'سند جدید',
      icon: 'file' as const,
      href: `/admin/collections/project-documents/${item.id}`,
    })),
  ]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 5)

  return (
    <Gutter className="pof-dashboard">
      <AdminWelcome
        name={req.user?.name || req.user?.username || 'همکار'}
        role={identity.role}
      />
      <section className="pof-stats" aria-label="نمای کلی مدیریت">
        {stats.map((stat) => (
          <Link className="pof-stat" href={stat.href} key={stat.label}>
            <div>
              <span className="pof-stat-label">{stat.label}</span>
              <strong>{number(stat.value)}</strong>
              <small>{stat.detail}</small>
            </div>
            <span className="pof-stat-icon">
              <AdminGlyph name={stat.icon} />
            </span>
          </Link>
        ))}
      </section>
      <div className="pof-dashboard-grid">
        <section
          className="pof-panel pof-projects"
          aria-labelledby="pof-projects-title"
        >
          <div className="pof-panel-heading">
            <div>
              <span className="pof-eyebrow">نمای پروژه‌ها</span>
              <h2 id="pof-projects-title">پروژه‌های شما</h2>
            </div>
            <Link className="pof-text-link" href="/admin/collections/projects">
              فهرست کامل <AdminGlyph name="arrow" />
            </Link>
          </div>
          <form
            className="pof-project-search"
            action="/admin"
            method="get"
            role="search"
            aria-label="جستجو و فیلتر پروژه‌ها"
          >
            <label className="pof-search-input">
              <AdminGlyph name="search" />
              <span className="pof-sr-only">نام، کد، محل پروژه یا کارفرما</span>
              <input
                type="search"
                name="q"
                defaultValue={filters.query}
                maxLength={120}
                placeholder="جستجوی نام، کد، محل یا کارفرما…"
              />
            </label>
            <label>
              <span className="pof-sr-only">وضعیت پروژه</span>
              <select name="status" defaultValue={filters.status}>
                <option value="">همه وضعیت‌ها</option>
                {Object.entries(projectStatusLabels).map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="pof-filter-button">
              جستجو
            </button>
            {(filters.query || filters.status) && (
              <Link className="pof-clear-filters" href="/admin">
                پاک کردن
              </Link>
            )}
          </form>
          <p className="pof-result-count" role="status">
            {number(projects.totalDocs)} پروژه
            {filters.query || filters.status
              ? ' با فیلتر انتخاب‌شده'
              : ' در دسترس شما'}
          </p>
          {projects.docs.length ? (
            <>
              <div
                className="pof-table-scroll"
                role="region"
                aria-label="جدول پروژه‌ها"
                tabIndex={0}
              >
                <table className="pof-project-table">
                  <thead>
                    <tr>
                      <th scope="col">پروژه / کد</th>
                      <th scope="col">محل پروژه</th>
                      <th scope="col">وضعیت</th>
                      <th scope="col">به‌روزرسانی</th>
                      <th scope="col">
                        <span className="pof-sr-only">عملیات</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.docs.map((project) => (
                      <tr key={project.id}>
                        <th scope="row">
                          <Link
                            className="pof-project-name"
                            href={`/projects/${project.id}`}
                          >
                            {project.name}
                          </Link>
                          <span className="pof-project-code" dir="auto">
                            {project.code}
                          </span>
                        </th>
                        <td>{project.site}</td>
                        <td>
                          <span
                            className={`pof-status pof-status--${project.status}`}
                          >
                            <span aria-hidden="true" />
                            {projectStatusLabels[project.status] ||
                              project.status}
                          </span>
                        </td>
                        <td>
                          <time dateTime={project.updatedAt}>
                            {formatPortalDate(project.updatedAt)}
                          </time>
                        </td>
                        <td>
                          <Link
                            className="pof-row-action"
                            href={
                              isAdmin
                                ? `/admin/collections/projects/${project.id}`
                                : `/projects/${project.id}`
                            }
                            aria-label={`${isAdmin ? 'ویرایش' : 'مشاهده'} ${project.name}`}
                          >
                            {isAdmin ? 'ویرایش' : 'مشاهده'}{' '}
                            <AdminGlyph name="arrow" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {projects.totalPages > 1 && (
                <nav className="pof-pagination" aria-label="صفحه‌بندی پروژه‌ها">
                  {projects.hasPrevPage ? (
                    <Link
                      href={dashboardURL(
                        filters.query,
                        filters.status,
                        filters.page - 1,
                      )}
                    >
                      صفحه قبل
                    </Link>
                  ) : (
                    <span />
                  )}
                  <span>
                    صفحه {number(filters.page)} از {number(projects.totalPages)}
                  </span>
                  {projects.hasNextPage ? (
                    <Link
                      href={dashboardURL(
                        filters.query,
                        filters.status,
                        filters.page + 1,
                      )}
                    >
                      صفحه بعد
                    </Link>
                  ) : (
                    <span />
                  )}
                </nav>
              )}
            </>
          ) : (
            <div className="pof-empty">
              <span className="pof-empty-icon">
                <AdminGlyph name="projects" />
              </span>
              <h3>
                {filters.query || filters.status
                  ? 'پروژه‌ای پیدا نشد.'
                  : 'هنوز پروژه‌ای اینجا نیست.'}
              </h3>
              <p>
                {filters.query || filters.status
                  ? 'عبارت جستجو یا وضعیت را تغییر دهید.'
                  : isAdmin
                    ? 'نخستین پروژه را بسازید و همکاران آن را مشخص کنید.'
                    : 'از مدیر دفتر بخواهید دسترسی پروژه را برای شما فعال کند.'}
              </p>
              {filters.query || filters.status ? (
                <Link href="/admin" className="pof-text-link">
                  نمایش همه پروژه‌ها
                </Link>
              ) : (
                isAdmin && (
                  <Link
                    className="pof-filter-button"
                    href="/admin/collections/projects/create"
                  >
                    ایجاد نخستین پروژه
                  </Link>
                )
              )}
            </div>
          )}
        </section>
        <aside className="pof-dashboard-aside">
          <section className="pof-panel" aria-labelledby="pof-shortcuts-title">
            <div className="pof-panel-heading">
              <div>
                <span className="pof-eyebrow">شروع سریع</span>
                <h2 id="pof-shortcuts-title">کار بعدی شما</h2>
              </div>
            </div>
            <nav className="pof-shortcuts" aria-label="عملیات سریع">
              {shortcuts.map((item) => (
                <Link href={item.href} key={item.href}>
                  <span className="pof-shortcut-icon">
                    <AdminGlyph name={item.icon} />
                  </span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.detail}</small>
                  </span>
                  <AdminGlyph name="arrow" />
                </Link>
              ))}
            </nav>
          </section>
          <section className="pof-panel" aria-labelledby="pof-activity-title">
            <div className="pof-panel-heading">
              <div>
                <span className="pof-eyebrow">جریان کار</span>
                <h2 id="pof-activity-title">آخرین فعالیت‌ها</h2>
              </div>
              <span className="pof-live-dot" aria-hidden="true" />
            </div>
            {activity.length ? (
              <ol className="pof-activity">
                {activity.map((item) => (
                  <li key={item.id}>
                    <span className="pof-activity-icon">
                      <AdminGlyph name={item.icon} />
                    </span>
                    <Link href={item.href}>
                      <small>{item.label}</small>
                      <strong>{item.title}</strong>
                      <time dateTime={item.date}>
                        {formatPortalDate(item.date, true)}
                      </time>
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="pof-empty-activity">
                با ثبت نخستین پیام یا سند، فعالیت‌های پروژه اینجا نمایش داده
                می‌شوند.
              </p>
            )}
          </section>
        </aside>
      </div>
      <p className="pof-dashboard-note">
        <AdminGlyph name="check" /> فقط اطلاعات پروژه‌هایی نمایش داده می‌شود که
        به آن‌ها دسترسی دارید.
      </p>
    </Gutter>
  )
}
