import React         from 'react'
import TestRenderer  from 'react-test-renderer'
import { useLocale } from '@atlantis-lab/react-locale'
import { compose }   from 'recompose'

import { withIntl }  from '../src/index'

describe('test suit for next-app-with-intl', function describer() {
  test('should wrap the component and provide a locale', function tester() {
    const withProviders = compose(withIntl({ default: 'en', supported: ['ru', 'en'] }))

    const ContentBlock = () => {
      const [getCurrent, getSupported] = useLocale()

      return <p>{`${getCurrent} ${getSupported}`}</p>
    }

    const App = withProviders(ContentBlock)

    const testRenderer = TestRenderer.create(<App messages='Message prop' />)

    expect(testRenderer.root.findByType('p').props.children).toBe('en ru,en')
  })
})
