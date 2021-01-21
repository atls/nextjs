import path                   from 'path'
import { sync }               from 'globby'

import Project                from '@lerna/project'

import { withWorkspaces }     from '../src/index'
import { nextConfig, webpackConfig } from './stub'

describe('test suit for next-config-with-workspaces', function describer() {
  test('should initialize the config', function tester() {
    const cwd = process.cwd()
    const project = new Project(cwd)

    const packageConfigPaths = (project.config.packages || []).reduce(
      (result, pkg: string) => [
        ...result,
        ...sync(path.join(pkg, 'package.json'), {
          cwd: project.rootPath,
          ignore: ['**/node_modules/**'],
          absolute: true,
        }),
      ],
      []
    )

    const includes = packageConfigPaths
      .filter(pkg => !pkg.includes(cwd))
      .map(pkg => path.dirname(pkg))
      .map(dirname => new RegExp(`${dirname}(?!.*node_modules)`))

    process.env.webpackStubConfig = JSON.stringify(webpackConfig)
    process.env.optionsStub = 'stub'

    const configResult = { ...withWorkspaces(nextConfig), ...withWorkspaces(nextConfig).webpack() }

    delete configResult.webpack

    const expectedWebpack = webpackConfig

    expectedWebpack.module.rules[0].include = includes

    expect(configResult).toMatchObject({ ...nextConfig, ...expectedWebpack })
  })
})
