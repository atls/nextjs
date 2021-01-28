import TestRenderer          from 'react-test-renderer'
import React, { useContext } from 'react'
import { compose }           from 'recompose'

import { withProvider }      from '../src/index'

describe('test suit for next-app-with-provider', function describer() {
  test('should wrap the component & provide a value', function tester() {
    const ctxString = 'Random context string'
    const Context = React.createContext(null)

    const Provider = ({ children }) => (
      <Context.Provider value={ctxString}>{children}</Context.Provider>
    )

    const Consumer = () => {
      const ctx = useContext(Context)

      return <p>{ctx}</p>
    }

    const withProviders = compose(withProvider(Provider))

    const App = withProviders(Consumer)

    const testRenderer = TestRenderer.create(<App />)

    expect(testRenderer.root.findByType('p').props.children).toBe(ctxString)
  })
})
