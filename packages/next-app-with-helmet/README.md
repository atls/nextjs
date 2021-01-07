# Next App With Helmet

## Install

```
yarn add @atlantis-lab/next-app-with-helmet
```

## Example usage

```typescript
import App            from 'next/app'
import compose        from 'recompose/compose'
import { withHelmet } from '@atlantis-lab/next-app-with-helmet'
export const withProviders = compose(withHelmet())
export default withProviders(App)
```
