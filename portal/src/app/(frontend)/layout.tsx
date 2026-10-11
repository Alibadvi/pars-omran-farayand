import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@fontsource/vazirmatn/arabic-400.css'
import '@fontsource/vazirmatn/arabic-700.css'
import '@fontsource/vazirmatn/latin-400.css'
import '@fontsource/vazirmatn/latin-700.css'
import './styles.css'

export const metadata: Metadata = { title: 'پرتال پروژه‌ها | پارس عمران فرآیند', robots: { index: false, follow: false } }

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <html lang="fa" dir="rtl"><body>{children}</body></html>
}
