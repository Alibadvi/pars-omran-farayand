import Image from 'next/image'

export function AdminLogo() {
  return <div className="pof-login-brand">
    <span className="pof-login-mark"><Image src="/logo.webp" alt="" width={44} height={44} /></span>
    <span><strong>پارس عمران فرآیند</strong><small>پرتال مدیریت پروژه‌ها و مکاتبات</small></span>
  </div>
}
