import fetch                                                               from 'isomorphic-unfetch'
import { ApolloClient, ApolloLink, createHttpLink, NormalizedCacheObject } from '@apollo/client'
import { InMemoryCache }                                                   from '@apollo/client'
import { onError }                                                         from '@apollo/link-error'

interface Fetch {
  (uri, options: any, props: any): Promise<any>
}

interface Options {
  uri: string
  fetch?: Fetch
  onUnauthenticated: () => void
}

let client: ApolloClient<NormalizedCacheObject> | null = null

const defaultFetch = (uri, options: any, props: any) => fetch(uri, options)

// prettier-ignore
if (!(process as any).browser) {
  (global as any).fetch = fetch
} else if (!window.fetch) {
  (window as any).fetch = fetch
}

function create(initialState = {}, options: Options, getProps) {
  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach((graphQLError) => {
        if (graphQLError.extensions && graphQLError.extensions.code === 'UNAUTHENTICATED') {
          options.onUnauthenticated()
        }
      })
    }
  })

  const httpLink = createHttpLink({
    uri: options.uri,
    credentials: 'same-origin',
    fetch: (fetchUri, fetchOptions) => {
      const fetchFn = options.fetch || defaultFetch

      return fetchFn(fetchUri, fetchOptions, getProps ? getProps() : {})
    },
  })

  return new ApolloClient({
    connectToDevTools: (process as any).browser,
    ssrMode: !(process as any).browser,
    cache: new InMemoryCache().restore(initialState),
    link: ApolloLink.from([errorLink, httpLink]),
  })
}

export default function initApollo(initialState, options, getProps) {
  if (!(process as any).browser) {
    return create(initialState, options, getProps)
  }

  if (!client) {
    client = create(initialState, options, getProps)
  }

  return client
}
