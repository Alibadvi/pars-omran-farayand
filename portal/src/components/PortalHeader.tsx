import Image from 'next/image'
import Link from 'next/link'

export function PortalHeader({ name }: { name: string }) {
  return <header className="topbar">
    <div className="topbar-inner">
      <Link className="brand" href="/" aria-label="صفحه اصلی پرتال">
        <span className="brand-mark"><Image alt="" src="/logo.webp" width={36} height={36} /></span>
        <span className="brand-copy"><strong>پارس عمران فرآیند</strong><small>پرتال مدیریت پروژه</small></span>
      </Link>
      <nav className="topbar-nav" aria-label="منوی اصلی">
        <Link href="/">پروژه‌ها</Link>
        <Link href="/admin">مدیریت</Link>
        <Link href="/admin/logout">خروج</Link>
      </nav>
      <div className="account" title={name}><span className="account-dot" aria-hidden="true" /><span>{name}</span></div>
    </div>
  </header>
}
