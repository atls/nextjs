import React          from 'react'
import TestRenderer   from 'react-test-renderer'
import { compose }    from 'recompose'

import { withHelmet } from '../src/index'

describe('test suit for next-app-with-helmet', function describer() {
  test('should wrap the component', function tester() {
    const withProviders = compose(withHelmet())

    const titlePlaceholder = 'Title placeholder'

    const AppHead = () => <title>{titlePlaceholder}</title>

    const App = withProviders(AppHead)

    const testRenderer = TestRenderer.create(<App />)

    expect(testRenderer.root.findByType('title').props.children).toBe(titlePlaceholder)
  })
})
