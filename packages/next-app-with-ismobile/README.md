# Next App With isMobile

## Install

```
yarn add @atlantis-lab/next-app-with-ismobile
```

## Example usage

```typescript
import App              from 'next/app'
import compose          from 'recompose/compose'
import { withIsMobile } from '@atlantis-lab/next-app-with-ismobile'
export const withProviders = compose(withIsMobile())
export default withProviders(App)
```
