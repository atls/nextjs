import fetch                                        from 'isomorphic-unfetch'
import { ApolloClient, ApolloLink, createHttpLink } from '@apollo/client'
import { InMemoryCache }                            from '@apollo/client'
import { onError }                                  from '@apollo/link-error'

import { networkStatusLink }                        from './network-status'

interface Options {
  uri: string
  headers?: any
  onUnauthenticated?: () => void
}

let globalApolloClient = null

const createApolloClient = (initialState = {}, options: Options) => {
  const errorLink = onError(({ graphQLErrors, operation }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach((graphQLError) => {
        if (
          graphQLError.extensions &&
          graphQLError.extensions.code === 'UNAUTHENTICATED' &&
          options.onUnauthenticated
        ) {
          options.onUnauthenticated()
        }
      })
    }

    const { response } = operation.getContext()

    if (response && response.status === 401 && options.onUnauthenticated) {
      options.onUnauthenticated()
    }
  })

  const httpLink = createHttpLink({
    uri: options.uri,
    credentials: 'same-origin',
    headers: options.headers,
    fetch,
  })

  return new ApolloClient({
    ssrMode: !(process as any).browser,
    cache: new InMemoryCache().restore(initialState),
    link: ApolloLink.from([errorLink, networkStatusLink.concat(httpLink)]),
  })
}

export const initApolloClient = (initialState, options) => {
  if (!(process as any).browser) {
    return createApolloClient(initialState, options)
  }

  if (!globalApolloClient) {
    // @ts-ignore
    globalApolloClient = createApolloClient(initialState, options)
  }

  return globalApolloClient
}
