const withWebpack5 = (nextConfig) => ({
  ...nextConfig,
  future: {
    webpack5: true,
  },
  webpack(config, options) {
    if (!config.resolve.fallback) {
      config.resolve.fallback = {} // eslint-disable-line
    }

    if (config.resolve.fallback) {
      config.resolve.fallback.events = require.resolve('events/') // eslint-disable-line
    } else {
      config.resolve.alias.events = require.resolve('events/') // eslint-disable-line
    }

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options)
    }

    return config
  },
})

export { withWebpack5 }
