import React                       from 'react'
import TestRenderer                from 'react-test-renderer'
import { ThemeProvider, useTheme } from '@emotion/react'
import { compose }                 from 'recompose'

import { withEmotion }             from '../src/index'

describe('test suit for next-app-with-emotion', function describer() {
  test('theme options should be provided to the component', function tester() {
    // eslint-disable-next-line
    window.__NEXT_DATA__ = { ids: [] }

    const appTheme = {
      colors: {
        primary: '#fff',
      },
    }

    const Provider = ({ children }) => <ThemeProvider theme={appTheme}>{children}</ThemeProvider>

    const withProviders = compose(withEmotion({ Provider }))

    function Consumer() {
      const theme = useTheme()

      return <p>{`${theme}`}</p>
    }

    const App = withProviders(Consumer)

    const testRenderer = TestRenderer.create(<App />)

    expect(testRenderer.root.findByType('p').props.children).toBe(`${appTheme}`)
  })
})
