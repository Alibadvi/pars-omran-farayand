import { mkdir, readFile, writeFile } from 'node:fs/promises'

const dist = new URL('../dist/', import.meta.url)
const template = await readFile(new URL('index.html', dist), 'utf8')

const routes = [
  {
    path: 'projects',
    title: 'Projects | Pars Omran Farayand',
    description: 'Selected energy and industrial projects in piping, refinery, tank fabrication, power, and civil works across Iran.',
  },
  {
    path: 'contact',
    title: 'Contact | Pars Omran Farayand',
    description: 'Contact Pars Omran Farayand in Tehran for energy and industrial project enquiries, tenders, and partnerships.',
  },
]

for (const route of routes) {
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*("\s*\/?>)/, `$1${route.description}$2`)
    .replace(/^\s*<link rel="preload" as="image"[^>]+layer-01-sky\.webp"[^>]*>\n/gm, '')

  const directory = new URL(`${route.path}/`, dist)
  await mkdir(directory, { recursive: true })
  await writeFile(new URL('index.html', directory), html)
}
