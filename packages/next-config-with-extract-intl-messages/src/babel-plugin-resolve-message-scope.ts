import fs             from 'fs'
import { types as t } from '@babel/core'
import { declare }    from '@babel/helper-plugin-utils'
import { dirname }    from 'path'
import { join }       from 'path'

const getPackageName = (filename, packagePath) => {
  try {
    const packageJsonPath = join(dirname(filename), packagePath)
    const packageJsonData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

    return packageJsonData.name
  } catch (error) {
    return null
  }
}

const templateLiteralVisitor = {
  TemplateLiteral(path) {
    if (this.MessagesScope && this.MessagesScopeIdentifier) {
      const expressions = path.get('expressions')

      if (
        expressions.some(
          (expr) => t.isIdentifier(expr.node) && expr.node.name === this.MessagesScopeIdentifier
        )
      ) {
        const nodes = []
        let index = 0

        // eslint-disable-next-line no-restricted-syntax
        for (const elem of path.node.quasis) {
          if (elem.value.cooked) {
            // @ts-ignore
            nodes.push(t.stringLiteral(elem.value.cooked))
          }

          if (index < expressions.length) {
            // eslint-disable-next-line no-plusplus
            const expr = expressions[index++]
            const { node } = expr

            if (t.isIdentifier(node) && node.name === this.MessagesScopeIdentifier) {
              // @ts-ignore
              nodes.push(t.stringLiteral(this.MessagesScope))
            } else if (!t.isStringLiteral(node, { value: '' })) {
              // @ts-ignore
              nodes.push(node)
            }
          }
        }

        if (nodes.every((node) => t.isStringLiteral(node))) {
          // @ts-ignore
          path.replaceWith(t.stringLiteral(nodes.reduce((result, node) => result + node.value, '')))
        }
      }
    }
  },
}

const visitor = {
  Program(path, state) {
    const packageNameImportNode = (path.node.body || []).find((node) => {
      if (!t.isImportDeclaration(node)) {
        return null
      }

      if (!(node.source.value || '').includes('package.json')) {
        return null
      }

      if (
        !node.specifiers.some(
          (specifier) => specifier.imported && specifier.imported.name === 'name'
        )
      ) {
        return null
      }

      return node
    })

    if (packageNameImportNode) {
      const scope = getPackageName(state.file.opts.filename, packageNameImportNode.source.value)

      if (scope) {
        const specifier = packageNameImportNode.specifiers.find(
          ({ imported }) => imported && imported.name === 'name'
        )

        this.MessagesScope = scope
        this.MessagesScopeIdentifier = specifier.local.name

        path.traverse(templateLiteralVisitor, state)
      }
    }
  },
}

export default declare((api) => {
  api.assertVersion(7)

  return {
    pre() {
      if (!this.MessagesScope) {
        this.MessagesScope = null
        this.MessagesScopeIdentifier = null
      }
    },

    visitor,
  }
})
