/** Share the same whitespace and length rules between the admin and REST API. */
export const trimText = ({ value }: { value?: unknown }) =>
  typeof value === 'string' ? value.trim() : value

export function requiredText(
  value: unknown,
  { maxLength }: { maxLength?: number },
) {
  if (typeof value !== 'string' || !value.trim())
    return 'این قسمت را کامل کنید؛ فاصله به‌تنهایی کافی نیست.'
  if (maxLength && value.length > maxLength)
    return `حداکثر ${maxLength.toLocaleString('fa-IR')} نویسه وارد کنید.`
  return true
}

export const requiredBody = requiredText
