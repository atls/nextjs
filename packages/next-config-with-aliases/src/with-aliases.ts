import { WithAliases } from './with-aliases.interface'

const withAliases: WithAliases = (aliases, require) => (nextConfig) => ({
  ...nextConfig,
  webpack(config, options) {
    aliases.forEach(
      // eslint-disable-next-line
      (alias) => (config.resolve.alias[alias] = require.resolve(alias.replace('$', '')))
    )

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options)
    }

    return config
  },
})

export { withAliases }
