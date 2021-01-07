# Next App With Auth

## Install

```
yarn add @atlantis-lab/next-app-with-auth
```

## Example usage

```typescript
import App          from 'next/app'
import compose      from 'recompose/compose'
import { withAuth } from '@atlantis-lab/next-app-with-auth'
export const withProviders = compose(withAuth())
export default withProviders(App)
```
