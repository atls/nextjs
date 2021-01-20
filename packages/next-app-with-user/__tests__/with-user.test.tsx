import React        from 'react'
import TestRenderer from 'react-test-renderer'
import { useUser }  from '@atlantis-lab/react-user'
import { compose }  from 'recompose'

import { withUser } from '../src/index'

describe('test suit for next-app-with-provider', function describer() {
  test("should check user's existence", function tester() {
    const withProviders = compose(withUser())

    const UserCheck = () => {
      const user = useUser()

      if (user) return <p>User</p>
      if (!user) return <p>No user</p>
      return {}
    }

    const App = withProviders(UserCheck)

    let testRenderer = TestRenderer.create(<App user />)

    expect(testRenderer.root.findByType('p').props.children).toBe('User')

    testRenderer = TestRenderer.create(<App user={false} />)

    expect(testRenderer.root.findByType('p').props.children).toBe('No user')
  })
})
