/* eslint-disable no-underscore-dangle */
import React            from 'react'
import { Component }    from 'react'
import { AuthProvider } from '@atls/react-auth'
import { NEXT_DATA }    from 'next/dist/next-server/lib/utils'

declare global {
  interface Window {
    // @ts-ignore
    __NEXT_DATA__: NEXT_DATA
  }
}

type Props = {
  token?: string
}

export const withAuth = () => (WrapperComponent) =>
  class WithAuth extends Component<Props> {
    static async getInitialProps(context) {
      let props = {}

      const {
        ctx: { req },
      } = context

      if (WrapperComponent.getInitialProps) {
        props = await WrapperComponent.getInitialProps(context)
      }

      let token = null

      if (req && typeof req.get === 'function' && req.get('authorization')) {
        token = req.get('authorization')
      } else if ((process as any).browser) {
        token = window.__NEXT_DATA__.props.token // eslint-disable-line prefer-destructuring
      }

      return {
        ...props,
        token,
      }
    }

    render() {
      const { token } = this.props

      return (
        <AuthProvider value={token}>
          <WrapperComponent {...this.props} token={token} />
        </AuthProvider>
      )
    }
  }
