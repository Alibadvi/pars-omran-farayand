'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { projectStatusLabels } from '@/lib/presentation'

type Project = { id: number | string; code: string; name: string; site: string; status: string; updated: string }
type Filter = 'all' | 'active' | 'planning' | 'on-hold' | 'completed'

export function ProjectDirectory({ projects, total }: { projects: Project[]; total: number }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const filtered = useMemo(() => {
    const search = query.trim().toLocaleLowerCase('fa-IR')
    return projects.filter((project) =>
      (filter === 'all' || project.status === filter) &&
      (!search || `${project.name} ${project.code} ${project.site}`.toLocaleLowerCase('fa-IR').includes(search)),
    )
  }, [filter, projects, query])

  return <section className="directory" aria-labelledby="directory-title">
    <div className="section-heading"><div><p className="eyebrow">فهرست کارها</p><h2 id="directory-title">پروژه‌های شما</h2></div><span className="section-count">{total.toLocaleString('fa-IR')} پروژه</span></div>
    <div className="directory-tools">
      <label className="search-field"><span className="visually-hidden">جستجوی پروژه</span><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جستجو بر اساس نام، کد یا محل پروژه" /></label>
      <div className="filter-list" role="group" aria-label="فیلتر وضعیت پروژه">
        {([['all', 'همه'], ['active', 'در حال اجرا'], ['planning', 'برنامه‌ریزی'], ['on-hold', 'متوقف'], ['completed', 'تکمیل‌شده']] as const).map(([value, label]) =>
          <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}
      </div>
    </div>
    {filtered.length > 0 ? <div className="project-grid">{filtered.map((project) => <Link className="project-card" href={`/projects/${project.id}`} key={project.id}>
      <div className="card-top"><span className="project-code" dir="ltr">{project.code}</span><span className={`pill pill-${project.status}`}>{projectStatusLabels[project.status] || project.status}</span></div>
      <div><h3>{project.name}</h3><p>{project.site}</p></div>
      <div className="card-bottom"><span>آخرین به‌روزرسانی: {project.updated}</span><span className="card-link" aria-hidden="true">←</span></div>
    </Link>)}</div> : <div className="empty-state"><strong>{projects.length ? 'پروژه‌ای با این مشخصات پیدا نشد.' : 'هنوز پروژه‌ای برای حساب شما ثبت نشده است.'}</strong><p>{projects.length ? 'عبارت جستجو یا فیلتر وضعیت را تغییر دهید.' : 'مدیر دفتر تهران می‌تواند نخستین پروژه را از بخش مدیریت بسازد.'}</p>{projects.length > 0 && <button type="button" onClick={() => { setQuery(''); setFilter('all') }}>پاک‌کردن فیلترها</button>}</div>}
    {total > projects.length && <p className="list-note">جدیدترین {projects.length.toLocaleString('fa-IR')} پروژه نشان داده شده‌اند. برای مشاهده همه پروژه‌ها به <Link href="/admin/collections/projects">فهرست مدیریت</Link> بروید.</p>}
  </section>
}
