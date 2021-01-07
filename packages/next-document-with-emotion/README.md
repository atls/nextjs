# Next Document With Emotion

## Install

```
yarn add @atlantis-lab/next-document-with-emotion
```

## Example usage

```typescript
import Document        from 'next/document'
import compose         from 'recompose/compose'
import { withEmotion } from '@atlantis-lab/next-document-with-emotion'
const withProviders = compose(withEmotion())
export default withProviders(Document)
```
