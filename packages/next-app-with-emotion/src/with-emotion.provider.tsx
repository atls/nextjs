/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-deprecated */
import React             from 'react'
import { Component }     from 'react'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider } from '@emotion/react'
import createCache       from '@emotion/cache'
import { EmotionCache }  from '@emotion/cache'
import { NEXT_DATA }     from 'next/dist/next-server/lib/utils'

declare global {
  interface Window {
    __NEXT_DATA__: NEXT_DATA
  }
}

type Options = {
  Provider: any
  injectGlobalStyles?: () => void
}

type Props = {}

export const withEmotion =
  ({ Provider = ThemeProvider, injectGlobalStyles }: Options) =>
  (WrapperComponent) =>
    class WithEmotion extends Component<Props> {
      cache: EmotionCache

      constructor(props, context) {
        super(props, context)

        if (injectGlobalStyles) {
          injectGlobalStyles()
        }

        this.cache = createCache({ key: 'emotion' })
      }

      render() {
        return (
          <CacheProvider value={this.cache}>
            <Provider>
              <WrapperComponent {...this.props} />
            </Provider>
          </CacheProvider>
        )
      }
    }
