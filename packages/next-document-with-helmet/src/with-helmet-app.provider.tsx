import type { AppContext }        from 'next/app'
import type { AppInitialProps }   from 'next/app'
import type { AppProps }          from 'next/app'
import type { AppType }           from 'next/app'
import type { PropsWithChildren } from 'react'

import { HelmetProvider }         from '@dr.pogodin/react-helmet'
import { useContext }             from 'react'
import React                      from 'react'

import { HelmetStateContext }     from './helmet-state.context.js'

const HelmetAppProvider = ({ children }: PropsWithChildren) => {
  const onServerState = useContext(HelmetStateContext)

  return <HelmetProvider onServerState={onServerState}>{children}</HelmetProvider>
}

export const withHelmetApp = () => (AppComponent: AppType) =>
  class WithHelmetApp extends React.Component<AppProps> {
    static async getInitialProps(context: AppContext): Promise<Partial<AppInitialProps>> {
      return AppComponent.getInitialProps?.(context) ?? {}
    }

    render() {
      return (
        <HelmetAppProvider>
          <AppComponent {...this.props} />
        </HelmetAppProvider>
      )
    }
  }
