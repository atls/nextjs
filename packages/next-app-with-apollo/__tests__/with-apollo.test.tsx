import React                 from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { gql, useQuery }     from '@apollo/client'
import { compose }           from 'recompose'

import { withApollo }        from '../src/index'

describe('test suit for next-app-with-apollo', function describer() {
  test('should start data fetching using provided ApolloClient', function tester() {
    const withProviders = compose(
      withApollo({
        uri: 'https://48p1r2roz4.sse.codesandbox.io',
      }),
    )

    const EXCHANGE_RATES = gql`
      query GetExchangeRates {
        rates(currency: "USD") {
          currency
          rate
        }
      }
    `

    function ExchangeRates() {
      const { loading, data } = useQuery(EXCHANGE_RATES)

      if (loading) return <p>Loading...</p>
      if (data) return <p>Data is here</p>
    }

    const App = withProviders(({ Component }) => <Component Component={ExchangeRates} />)

    const testRenderer = TestRenderer.create(<App Component={ExchangeRates} />)

    expect(testRenderer.root.findByType('p').props.children).toBe('Loading...')

    act(() => {
      testRenderer.update()
    })
  })
})
