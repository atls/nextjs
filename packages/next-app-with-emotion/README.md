# Next App With Emotion

## Install

```
yarn add @atlantis-lab/next-app-with-emotion
```

## Example usage

```typescript
import App                                   from 'next/app'
import compose                               from 'recompose/compose'
import { ThemeProvider, injectGlobalStyles } from '@ui/theme'
import { withEmotion }                       from '@atlantis-lab/next-app-with-emotion'
export const withProviders = compose(withEmotion({ Provider: ThemeProvider, injectGlobalStyles }))
export default withProviders(App)
```
