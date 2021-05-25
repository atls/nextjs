import path from 'path'

export const withExtractIntlMessages = (nextConfig: any = {}) => {
  const { reactIntlExtractOptions = {}, reactIntlOptions = {} }: any = nextConfig

  if (!reactIntlExtractOptions.extract) {
    return nextConfig
  }

  const reactIntlPluginOptions = {
    ...reactIntlOptions,
    messagesDir: reactIntlOptions.messagesDir || path.join(process.cwd(), 'messages'),
  }

  return {
    ...nextConfig,
    webpack(config, options) {
      config.module.rules.forEach((rule) => {
        if (rule.use && rule.use.loader === 'next-babel-loader') {
          // eslint-disable-next-line
          rule.use.options.plugins = [
            ...(rule.use.options.plugins || []),
            require.resolve('./babel-plugin-resolve-message-scope'),
            [require.resolve('babel-plugin-react-intl'), reactIntlPluginOptions],
          ]
        }
      })

      // eslint-disable-next-line global-require
      const { CombineMessagesPlugin } = require('./combine-messages.webpack-plugin')

      const prefix = options.isServer ? 'server' : 'client'

      config.plugins.push(
        new CombineMessagesPlugin(
          reactIntlPluginOptions.messagesDir,
          path.join(reactIntlPluginOptions.messagesDir, `messages-${prefix}.json`)
        )
      )

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    },
  }
}
