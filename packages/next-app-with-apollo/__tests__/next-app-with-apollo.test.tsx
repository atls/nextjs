import App            from 'next/app'
import React from 'react'
import {compose,enhanced}        from 'recompose'
import TestRenderer from 'react-test-renderer'

import { withApollo } from '../src/with-apollo.provider'

test('should initialize ApolloClient', function tester(){


    const withProviders = compose(
        withApollo({
            uri: 'https://example.site',
            fetch: (uri, options, props) => {
                if (props.token) {
                    options.headers.authorization = props.token
                }
                if (typeof window !== 'undefined' && window.__NEXT_DATA__.props.token) {
                    options.headers.authorization = window.__NEXT_DATA__.props.token
                }
                return fetch(uri, options)
            },
        })
    )


    const Wrapper = withProviders(({ fetch }) => <h1>{'Wrapped'}</h1>)


    const testRenderer = TestRenderer.create(<Wrapper/>)

    expect(testRenderer.root.findByType('h1').props.children).toBe('Wrapped');
})
