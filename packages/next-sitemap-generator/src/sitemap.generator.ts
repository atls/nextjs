import { mkdir }     from 'node:fs/promises'
import { readdir }   from 'node:fs/promises'
import { writeFile } from 'node:fs/promises'
import { join }      from 'node:path'

import { js2xml }    from 'xml-js'

const bootstrap = async (): Promise<void> => {
  const cwd = process.cwd()
  const pages = await readdir(join(cwd, 'src/pages'))
  const pageUrls: Array<{ loc: string; lastmod: string; priority: string }> = []
  const struct = {
    urlset: {
      _attributes: {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:schemaLocation':
          'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',
      },
      url: pageUrls,
    },
  }

  const host = process.argv.slice(2)[0]

  if (host.endsWith('/')) {
    throw new Error(`Host name should not end with '/'`)
  }

  const protocol = host.split('/')[0]

  if (protocol !== 'http:' && protocol !== 'https:') {
    throw new Error(`Protocol is missing or invalid`)
  }

  for (const page of pages.filter((p) => !['_document.tsx', '_app.tsx'].includes(p))) {
    pageUrls.push({
      loc: `${host}/${page.replace('.tsx', '').replace('.ts', '').replace('index', '')}`,
      lastmod: new Date().toISOString(),
      priority: page === 'index.ts' ? '1.00' : '0.80',
    })
  }

  const xml = js2xml(struct, { compact: true })

  await mkdir(join(cwd, 'src/public'), { recursive: true })
  await writeFile(join(cwd, 'src/public/sitemap_index.xml'), xml)
}

bootstrap().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`
  )
  process.exitCode = 1
})
