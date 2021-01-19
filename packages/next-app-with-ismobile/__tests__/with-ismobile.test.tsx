import React         from 'react'
import TestRenderer  from 'react-test-renderer'
import { compose }   from 'recompose'

import { withIsMobile }  from '../src/index'

describe('test suit for next-app-with-ismobile', function describer() {
    test('should detect if the device mobile or not (mobile)', function tester() {
        const withProviders = compose(withIsMobile())

        const Content = ({ isMobile }) => {
            if (isMobile) return <p>{'Actually mobile'}</p>
            if (!isMobile) return <p>{'Actually not mobile'}</p>
        }

        const App = withProviders(({ Component }) => <Component Component={Content} />)

        const testRenderer = TestRenderer.create(<App isMobileVersion={true} Component={Content} />)

        expect(testRenderer.root.findByType('p').props.children).toBe('Actually mobile')
    })

    test('should detect if the device mobile or not (not mobile)', function tester() {
        const withProviders = compose(withIsMobile())

        const Content = ({ isMobile }) => {
            if (isMobile) return <p>{'Actually mobile'}</p>
            if (!isMobile) return <p>{'Actually not mobile'}</p>
        }

        const App = withProviders(({ Component }) => <Component Component={Content} />)

        const testRenderer = TestRenderer.create(<App isMobileVersion={false} Component={Content} />)

        expect(testRenderer.root.findByType('p').props.children).toBe('Actually not mobile')
    })
})
