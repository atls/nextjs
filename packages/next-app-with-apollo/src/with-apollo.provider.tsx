/* eslint-disable max-classes-per-file */
import Head                from 'next/head'
import React               from 'react'
import { ApolloProvider }  from '@apollo/client'
import { getDataFromTree } from '@apollo/react-ssr'

import initApollo          from './init-apollo'

interface Options {
  uri: string
  fetch?: any
  resetStoreKeys?: string[]
  wrapApp?: boolean
}

type Props = {
  Component: any
}

export const withApollo =
  ({ uri, fetch, wrapApp, resetStoreKeys = ['locale'] }: Options) =>
  (WrapperComponent) => {
    class ClientContainer extends React.Component<Props> {
      apolloClient: any

      constructor(props) {
        super(props)

        this.apolloClient = initApollo(
          props.apolloState,
          {
            uri,
            fetch,
            onUnauthenticated: () => {
              window.location.href = '/logout'
            },
          },
          () => this.props
        )
      }

      componentDidUpdate(prevProps) {
        const reset = resetStoreKeys.reduce((result, key) => {
          // eslint-disable-next-line react/destructuring-assignment
          if (prevProps[key] !== this.props[key]) {
            return true
          }

          return result
        }, false)

        if (reset) {
          this.apolloClient.resetStore()
        }
      }

      render() {
        const { Component } = this.props

        return (
          <ApolloProvider client={this.apolloClient}>
            <Component {...this.props} />
          </ApolloProvider>
        )
      }
    }

    return class WithApollo extends React.Component<Props> {
      apolloState: any

      static async getInitialProps(ctx) {
        const {
          Component,
          AppTree,
          router,
          ctx: { res },
        } = ctx

        let props = {}

        if (WrapperComponent.getInitialProps) {
          props = await WrapperComponent.getInitialProps(ctx)
        }

        const apollo = initApollo(
          {},
          {
            uri,
            fetch,
            onUnauthenticated: () => {
              res.writeHead(302, {
                Location: '/logout',
              })

              res.end()
            },
          },
          () => props
        )

        ctx.ctx.apolloClient = apollo

        if (res && res.finished) {
          return {}
        }

        if (!(process as any).browser) {
          try {
            const tree = wrapApp ? (
              <AppTree {...props} />
            ) : (
              <WrapperComponent
                {...props}
                router={router}
                Component={(wrapperProps) => (
                  <ApolloProvider client={apollo}>
                    <Component {...props} {...wrapperProps} />
                  </ApolloProvider>
                )}
              />
            )

            await getDataFromTree(tree)
          } catch (error) {
            console.error('Error while running `getDataFromTree`', error) // eslint-disable-line no-console
          }

          Head.rewind()
        }

        const apolloState = apollo.cache.extract()

        return {
          ...props,
          apolloState,
          apolloUrl: uri,
        }
      }

      public apolloClient: any

      constructor(props) {
        super(props)

        this.apolloState = props.apolloState
      }

      render() {
        const { Component } = this.props

        return (
          <WrapperComponent
            {...this.props}
            Component={(wrapperProps) => (
              <ClientContainer
                {...wrapperProps}
                Component={Component}
                apolloState={this.apolloState}
              />
            )}
          />
        )
      }
    }
  }
