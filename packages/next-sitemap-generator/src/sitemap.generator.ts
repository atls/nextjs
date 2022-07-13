import * as process      from 'process'

import { readdirSync }   from 'fs'
import { writeFileSync } from 'fs'
import { existsSync }    from 'fs'
import { mkdirSync }     from 'fs'
import { js2xml }        from 'xml-js'

const bootstrap = () => {
  const cwd = process.cwd()
  const pages = readdirSync(`${cwd}/src/pages`)
  const pageUrls: Array<any> = []
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

  if (host.charAt(host.length - 1) === '/') {
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

  if (!existsSync(`${cwd}/src/public/`)) mkdirSync(`${cwd}/src/public/`)

  writeFileSync(`${cwd}/src/public/sitemap_index.xml`, xml)
}

bootstrap()
