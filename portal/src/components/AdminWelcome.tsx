import Link from 'next/link'

import { portalRoleLabels } from '../lib/admin'
import { AdminGlyph } from './AdminGlyph'

export function AdminWelcome({ name, role }: { name: string; role: string }) {
  return (
    <section className="pof-admin-welcome" aria-labelledby="pof-admin-title">
      <div className="pof-admin-welcome__intro">
        <span className="pof-admin-welcome__kicker">
          پارس عمران فرآیند / مرکز مدیریت
        </span>
        <h1 id="pof-admin-title">سلام {name}، خوش آمدید.</h1>
        <p>
          وضعیت پروژه‌ها را مرور کنید، اسناد را پیدا کنید و کار بعدی را از
          همین‌جا شروع کنید.
        </p>
        <div className="pof-hero-actions">
          {role === 'hq-admin' && (
            <Link
              href="/admin/collections/projects/create"
              className="pof-admin-welcome__primary"
            >
              <AdminGlyph name="plus" /> ایجاد پروژه
            </Link>
          )}
          <Link href="/" className="pof-hero-secondary">
            ورود به فضای کاری <AdminGlyph name="arrow" />
          </Link>
        </div>
      </div>
      <div className="pof-hero-aside">
        <span className="pof-hero-emblem">
          <AdminGlyph name="projects" />
        </span>
        <strong>همه‌چیز، در مسیر پروژه.</strong>
        <span>{portalRoleLabels[role] || 'همکار پروژه'}</span>
        <small>اطلاعات این صفحه بر اساس دسترسی حساب شماست.</small>
      </div>
    </section>
  )
}
