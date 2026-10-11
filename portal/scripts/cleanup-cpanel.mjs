import fs from 'node:fs'

fs.rmSync(new URL('../.release-stage', import.meta.url), { recursive: true, force: true })
console.log('Release ready: portal-cpanel.tar.gz')
