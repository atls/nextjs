# Next App With Provider

## Install

```
yarn add @atlantis-lab/next-app-with-provider
```

## Example usage

```typescript
import App                     from 'next/app'
import compose                 from 'recompose/compose'
import { StoreProvider }       from '@store/stores'
import { CookieModalProvider } from '@ui/cookie-modal'
import { withProvider }        from '@atlantis-lab/next-app-with-provider'
export const withProviders = compose(withProvider(StoreProvider), withProvider(CookieModalProvider))
export default withProviders(App)
```
