import Document        from 'next/document'
import { compose }     from 'recompose'

import { withEmotion } from '../src/index'

describe('test suit for next-document-with-emotion', function describer() {
  test('should check if document renders', function tester() {
    const withProviders = compose(withEmotion())

    expect(`${withProviders(Document).render}`).toBeTruthy()
  })
})
