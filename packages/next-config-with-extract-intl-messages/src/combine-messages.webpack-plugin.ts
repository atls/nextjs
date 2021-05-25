import fs       from 'fs'
import { sync } from 'globby'

export class CombineMessagesPlugin {
  constructor(private source: string, private target: string) {}

  apply(compiler) {
    compiler.hooks.done.tap('Combine Messages', () => {
      const filenames = sync('**/*.json', {
        cwd: this.source,
        absolute: true,
      })

      const files = filenames.map((filename) => fs.readFileSync(filename, 'utf8'))

      const messages = files
        .map((file) => JSON.parse(file.toString()))
        .reduce((result, items) => result.concat(items), [])
        .reduce((result, { id, defaultMessage }) => ({ ...result, [id]: defaultMessage }), {})

      fs.writeFileSync(this.target, JSON.stringify(messages, null, 2))
    })
  }
}
