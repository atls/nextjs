# Next App With User

## Install

```
yarn add @atlantis-lab/next-app-with-user
```

## Example usage

```typescript
import App          from 'next/app'
import compose      from 'recompose/compose'
import { withUser } from '@atlantis-lab/next-app-with-user'
export const withProviders = compose(withUser())
export default withProviders(App)
```
