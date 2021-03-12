import Document       from 'next/document'
import { compose }    from 'recompose'

import { withHelmet } from '../src/index'

describe('test suit for next-document-with-helmet', function describer() {
  test('should override documents head', function tester() {
    const withProviders = compose(withHelmet())

    const Doc = withProviders(Document)

    expect(Doc).not.toBe(Document)
    expect(Doc).toBeTruthy()
  })
})
