// eslint-disable-next-line
import App                   from 'next/app'
import React          from 'react'
import TestRenderer   from 'react-test-renderer'
import { compose }    from 'recompose'

import { withApollo } from '../src/with-apollo.provider'

test('should initialize ApolloClient', function tester() {
  const withProviders = compose(
    withApollo({
      uri: 'https://example.site',
    })
  )

  const Wrapper = withProviders(() => <h1>Wrapped</h1>)

  const testRenderer = TestRenderer.create(<Wrapper />)

  expect(testRenderer.root.findByType('h1').props.children).toBe('Wrapped')
})
