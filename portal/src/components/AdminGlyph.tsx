type Glyph =
  | 'projects'
  | 'people'
  | 'file'
  | 'message'
  | 'arrow'
  | 'plus'
  | 'search'
  | 'activity'
  | 'mail'
  | 'check'

const paths: Record<Glyph, string> = {
  projects: 'M3 7h18v13H3z M3 7V4h7l2 3 M8 11v5 M12 11v5 M16 11v5',
  people:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  file: 'M14 2H6v20h12V6z M14 2v5h5 M9 12h6 M9 16h6',
  message:
    'M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9H13a8.5 8.5 0 0 1 8 8v.5z',
  arrow: 'M19 12H5 M11 6l-6 6 6 6',
  plus: 'M12 5v14 M5 12h14',
  search: 'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  activity: 'M3 12h4l3-8 4 16 3-8h4',
  mail: 'M3 5h18v14H3z M3 5l9 8 9-8',
  check: 'M5 12l4 4L19 6',
}

export function AdminGlyph({ name }: { name: Glyph }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  )
}
