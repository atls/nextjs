/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-deprecated */
import React, { Component } from 'react'
import { CacheProvider }    from '@emotion/core'
import { ThemeProvider }    from 'emotion-theming'
import { cache }            from 'emotion'

declare global {
  interface Window {
    __NEXT_DATA__: any
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
      constructor(props, context) {
        super(props, context)

        if (injectGlobalStyles) {
          injectGlobalStyles()
        }
      }

      render() {
        return (
          <CacheProvider value={cache}>
            <Provider>
              <WrapperComponent {...this.props} />
            </Provider>
          </CacheProvider>
        )
      }
    }
