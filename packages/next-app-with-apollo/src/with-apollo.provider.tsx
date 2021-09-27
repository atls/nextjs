import App                  from 'next/app'
import Head                 from 'next/head'
import React                from 'react'
import { ApolloProvider }   from '@apollo/client'

import { initApolloClient } from './apollo.client'
import { initOnContext }    from './apollo.context'
import { extractHeaders }   from './headers'

interface Options {
  uri: string
  headers?: any
  resetStoreKeys?: string[]
  onUnauthenticated: () => void
}

export const withApollo =
  ({ uri, headers = [], resetStoreKeys = [], onUnauthenticated }: Options) =>
  (PageComponent) => {
    const WithApollo = ({ apolloClient, apolloState, apolloOptions, ...pageProps }) => {
      let client
      if (apolloClient) {
        client = apolloClient
      } else {
        client = initApolloClient(apolloState, { ...apolloOptions, onUnauthenticated })
      }

      return (
        <ApolloProvider client={client}>
          <PageComponent {...pageProps} />
        </ApolloProvider>
      )
    }

    if (process.env.NODE_ENV !== 'production') {
      const displayName = PageComponent.displayName || PageComponent.name || 'Component'
      WithApollo.displayName = `withApollo(${displayName})`
    }

    WithApollo.getInitialProps = async (ctx) => {
      const inAppContext = Boolean(ctx.ctx)

      const apolloOptions = {
        uri,
        headers: extractHeaders(ctx, headers),
      }

      let pageProps = {}

      const { apolloClient } = initOnContext(ctx, apolloOptions)

      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx)
      } else if (inAppContext) {
        pageProps = await App.getInitialProps(ctx)
      }

      if (typeof window === 'undefined') {
        const { AppTree } = ctx

        if (ctx.res && ctx.res.finished) {
          return pageProps
        }

        if (AppTree) {
          try {
            const { getDataFromTree } = await import('@apollo/react-ssr')

            let props
            if (inAppContext) {
              props = { ...pageProps, apolloClient }
            } else {
              props = { pageProps: { ...pageProps, apolloClient } }
            }

            await getDataFromTree(<AppTree {...props} />)
          } catch (error) {
            // eslint-disable-next-line
            console.error('Error while running `getDataFromTree`', error)
          }

          ;(Head as any).rewind()
        }
      }

      return {
        ...pageProps,
        apolloOptions,
        apolloState: apolloClient.cache.extract(),
        apolloClient: ctx.apolloClient,
      }
    }

    return WithApollo
  }
