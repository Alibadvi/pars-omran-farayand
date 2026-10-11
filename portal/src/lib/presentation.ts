export const projectStatusLabels: Record<string, string> = {
  planning: 'در برنامه‌ریزی',
  active: 'در حال اجرا',
  'on-hold': 'متوقف‌شده',
  completed: 'تکمیل‌شده',
}

export const documentCategoryLabels: Record<string, string> = {
  contract: 'قرارداد',
  drawing: 'نقشه',
  correspondence: 'مکاتبه',
  progress: 'گزارش پیشرفت',
  other: 'سایر',
}

export const emailStatusLabels: Record<string, string> = {
  pending: 'در حال بررسی',
  accepted: 'تحویل‌شده به Outlook',
  received: 'پاسخ دریافتی',
  failed: 'ارسال ناموفق',
}

const dateFormatter = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
const timeFormatter = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

export function formatPortalDate(value: string, withTime = false) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : (withTime ? timeFormatter : dateFormatter).format(date)
}
