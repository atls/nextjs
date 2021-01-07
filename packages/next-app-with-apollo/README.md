# Next App With Apollo

## Install

```
yarn add @atlantis-lab/next-app-with-apollo
```

## Example usage

```typescript
import App            from 'next/app'
import compose        from 'recompose/compose'
import { withApollo } from '@atlantis-lab/next-app-with-apollo'
export const withProviders = compose(
  withApollo({
    uri: (process as any).browser
      ? window.__NEXT_DATA__.props.apolloUrl
      : process.env.PUBLIC_GATEWAY_URL || 'https://domain.zone/graphql',
    fetch: (uri, options, props) => {
      if (props.token) {
        options.headers.authorization = props.token
      }
      if (typeof window !== 'undefined' && window.__NEXT_DATA__.props.token) {
        options.headers.authorization = window.__NEXT_DATA__.props.token
      }
      return fetch(uri, options)
    },
  })
)
export default withProviders(App)
```
