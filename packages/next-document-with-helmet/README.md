# Next Document With Helmet

## Install

```
yarn add @atlantis-lab/next-document-with-helmet
```

## Example usage

```typescript
import Document       from 'next/document'
import compose        from 'recompose/compose'
import { withHelmet } from '@atlantis-lab/next-document-with-helmet'
const withProviders = compose(withHelmet())
export default withProviders(Document)
```
