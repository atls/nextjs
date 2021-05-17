/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-deprecated */
import React, { Component } from 'react'
import { ThemeProvider }    from '@emotion/react'
import { hydrate }          from '@emotion/css'

type Options = {
  Provider: any
  injectGlobalStyles?: () => void
}

type Props = {}

export const withEmotion = ({
  Provider = ThemeProvider,
  injectGlobalStyles,
}: Options) => WrapperComponent =>
  class WithEmotion extends Component<Props> {
    static async getInitialProps(context) {
      if (WrapperComponent.getInitialProps) {
        return WrapperComponent.getInitialProps(context)
      }

      return {}
    }

    componentWillMount() {
      if (typeof window !== 'undefined' && (window as any).__NEXT_DATA__.ids) {
        hydrate((window as any).__NEXT_DATA__.ids)
      }

      if (injectGlobalStyles) {
        injectGlobalStyles()
      }
    }

    render() {
      return (
        <Provider>
          <WrapperComponent {...this.props} />
        </Provider>
      )
    }
  }
