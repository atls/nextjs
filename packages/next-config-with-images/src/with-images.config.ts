export const withImages = (nextConfig) => ({
  ...nextConfig,
  webpack(config, options) {
    config.module.rules.forEach((rule) => {
      if (rule.loader === 'next-image-loader') {
        // eslint-disable-next-line no-param-reassign
        rule.loader = require.resolve('./next-image.loader')
      }
    })

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options)
    }

    return config
  },
})
