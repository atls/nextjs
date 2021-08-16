/* eslint-disable no-underscore-dangle */
import React            from 'react'
import { Component }    from 'react'
import { UserProvider } from '@atls/react-user'
import { NEXT_DATA }    from 'next/dist/next-server/lib/utils'

declare global {
  interface Window {
    // @ts-ignore
    __NEXT_DATA__: NEXT_DATA
  }
}

type Props = {
  user?: string
}

export const withUser = () => (WrapperComponent) =>
  class WithUser extends Component<Props> {
    static async getInitialProps(context) {
      let props = {}

      const {
        ctx: { req },
      } = context

      if (WrapperComponent.getInitialProps) {
        props = await WrapperComponent.getInitialProps(context)
      }

      let user = null

      if (req && req.get('x-user')) {
        user = req.get('x-user')
      } else if ((process as any).browser) {
        user = window.__NEXT_DATA__.props.user // eslint-disable-line prefer-destructuring
      }

      return {
        ...props,
        user,
      }
    }

    render() {
      const { user } = this.props

      return (
        <UserProvider value={user}>
          <WrapperComponent {...this.props} user={user} />
        </UserProvider>
      )
    }
  }
