import Link from 'next/link'

export function AdminWelcome() {
  return <section className="pof-admin-welcome" aria-labelledby="pof-admin-title">
    <div className="pof-admin-welcome__intro">
      <span className="pof-admin-welcome__kicker">پارس عمران فرآیند / مدیریت داخلی</span>
      <h1 id="pof-admin-title">فضای مدیریت پروژه‌ها</h1>
      <p>پروژه‌ها، همکاران، اسناد و مکاتبات را از اینجا مدیریت کنید. برای گفتگوی روزانه و بارگذاری فایل، وارد فضای کاری شوید.</p>
      <Link href="/" className="pof-admin-welcome__primary">ورود به فضای کاری <span aria-hidden="true">←</span></Link>
    </div>
    <nav className="pof-admin-welcome__links" aria-label="دسترسی سریع مدیریت">
      <Link href="/admin/collections/projects"><span aria-hidden="true">▦</span><span>پروژه‌ها<small>تعریف و ویرایش پروژه</small></span><b aria-hidden="true">←</b></Link>
      <Link href="/admin/collections/users"><span aria-hidden="true">◎</span><span>همکاران<small>حساب‌ها و دسترسی‌ها</small></span><b aria-hidden="true">←</b></Link>
      <Link href="/admin/collections/project-documents"><span aria-hidden="true">▤</span><span>اسناد<small>آرشیو فایل‌های پروژه</small></span><b aria-hidden="true">←</b></Link>
    </nav>
  </section>
}
