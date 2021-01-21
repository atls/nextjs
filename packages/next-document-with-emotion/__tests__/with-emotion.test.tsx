import React                                      from 'react'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import { compose }                                from 'recompose'

import { withEmotion }                            from '../src/index'

describe('test suit for next-document-with-emotion', function describer() {
  test('should check if document initializes', function tester() {
    const customDocTree = (
      <Html>
        <Head>
          <title>Test title</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )

    class MyDoc extends Document {
      render() {
        return customDocTree
      }
    }

    const withProviders = compose(withEmotion())

    const Doc = withProviders(MyDoc)

    const NewDoc = new Doc({ __NEXT_DATA__: { ids: ['12', '23', '34'] } })

    expect(NewDoc.render()).toBe(customDocTree)
  })
})
