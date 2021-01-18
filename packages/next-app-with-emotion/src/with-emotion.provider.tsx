/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-deprecated */
import React, { Component } from 'react'
import { ThemeProvider }    from '@emotion/react'
import { hydrate }          from 'emotion'

declare global {
  interface Window {
    __NEXT_DATA__: any
  }
}

type Options = {
  // Provider: any
  theme: {}
  injectGlobalStyles?: () => void
}

type Props = {}

export const withEmotion = ({ theme, injectGlobalStyles }: Options) => WrapperComponent =>
  class WithEmotion extends Component<Props> {
    static async getInitialProps(context) {
      if (WrapperComponent.getInitialProps) {
        return WrapperComponent.getInitialProps(context)
      }

      return {}
    }

    componentWillMount() {
      if (typeof window !== 'undefined' && window.__NEXT_DATA__.ids) {
        hydrate(window.__NEXT_DATA__.ids)
      }

      if (injectGlobalStyles) {
        injectGlobalStyles()
      }
    }

    render() {
      return (
        <ThemeProvider theme={theme}>
          <WrapperComponent {...this.props} />
        </ThemeProvider>
      )
    }
  }
