# Next App With Intl

## Install

```
yarn add @atlantis-lab/next-app-with-intl
```

## Example usage

```typescript
import App          from 'next/app'
import compose      from 'recompose/compose'
import { withIntl } from '@atlantis-lab/next-app-with-intl'
export const withProviders = compose(withIntl({ default: 'ru' }))
export default withProviders(App)
```
