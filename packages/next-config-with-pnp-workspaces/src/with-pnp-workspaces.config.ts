// eslint-disable-next-line
import pnpApi from 'pnpapi'

const isNextBabelLoaderRule = (rule) =>
  (rule.use && rule.use.loader === 'next-babel-loader') ||
  (Array.isArray(rule.use) && rule.use.some((use) => use && use.loader === 'next-babel-loader'))

export const withWorkspaces = (nextConfig) => ({
  ...nextConfig,
  webpack(config, options) {
    const workspaceLocators = pnpApi
      .getAllLocators()
      .filter(
        (locator) =>
          locator.reference !== 'workspace:.' && locator.reference.startsWith('workspace:')
      )

    const workspaces = workspaceLocators.map((locator) => locator.name)

    const includes = pnpApi
      .getAllLocators()
      .filter((locator) => workspaces.includes(locator.name))
      .map((locator) => pnpApi.getPackageInformation(locator).packageLocation)

    config.module.rules.forEach((rule) => {
      if (isNextBabelLoaderRule(rule)) {
        // eslint-disable-next-line no-param-reassign
        rule.include = rule.include.concat(includes)
      }
    })

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options)
    }

    return config
  },
})
