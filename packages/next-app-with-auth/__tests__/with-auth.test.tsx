import React        from 'react'
import TestRenderer from 'react-test-renderer'
import { useAuth }  from '@atlantis-lab/react-auth'
import { compose }  from 'recompose'

import { withAuth } from '../src/index'

describe('test suit for next-app-with-auth', function describer() {
  test('should return provided token', function tester() {
    const tokenStub = 'k4fSDeganfl4DSel'

    const withProviders = compose(withAuth())

    const Consumer = () => {
      const token = useAuth()

      return <p>{token}</p>
    }

    const App = withProviders(() => <Consumer />)

    const testRenderer = TestRenderer.create(<App token={tokenStub} />)

    expect(testRenderer.root.findByType('p').props.children).toBe(tokenStub)
  })
})
