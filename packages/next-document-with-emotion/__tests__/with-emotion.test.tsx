import Document        from 'next/document'
import { compose }     from 'recompose'

import { withEmotion } from '../src/index'

describe('test suit for next-document-with-emotion', function describer() {
  test('should check if document initializes', function tester() {
    const withProviders = compose(withEmotion())

    const Doc = withProviders(Document)

    expect(Doc).not.toBe(Document)
    expect(Doc).toBeTruthy()
  })
})
