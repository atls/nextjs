import React                                      from 'react'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import { compose }                                from 'recompose'

import { withHelmet }                             from '../src/index'

describe('test suit for next-document-with-helmet', function describer() {
  test('should override documents head', function tester() {
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
      static render() {
        return customDocTree
      }
    }

    const withProviders = compose(withHelmet())

    const Doc = withProviders(MyDoc)

    const newDoc = new Doc({
      helmet: {
        htmlAttributes: { toComponent: () => 1 },
        bodyAttributes: { toComponent: () => 2 },
      },
    })

    expect(newDoc.render()).not.toBe(customDocTree)
    expect(newDoc.render()).not.toBe('undefined')
  })
})
