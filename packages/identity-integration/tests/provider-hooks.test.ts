import type { Provider }        from 'react'

import assert                   from 'node:assert/strict'
import test                     from 'node:test'

import { createElement }        from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { ErrorProvider }        from '../src/providers/error.context.js'
import { FlowProvider }         from '../src/providers/flow.context.js'
import { SubmitProvider }       from '../src/providers/submit.context.js'
import { ValuesProvider }       from '../src/providers/values.context.js'
import { ValuesStore }          from '../src/providers/values.store.js'
import { useError }             from '../src/providers/use-error.hook.js'
import { useFlow }              from '../src/providers/use-flow.hook.js'
import { useSubmit }            from '../src/providers/use-submit.hook.js'
import { useValues }            from '../src/providers/use-values.hook.js'

const checkProvider = <T>(
  useValue: () => T,
  ProviderComponent: Provider<T | undefined>,
  value: T,
  message: string
): void => {
  let received: T | undefined
  const Reader = () => {
    received = useValue()

    return null
  }

  assert.throws(() => renderToStaticMarkup(createElement(Reader)), { message })
  renderToStaticMarkup(createElement(ProviderComponent, { value }, createElement(Reader)))
  assert.equal(received, value)
}

test('useError requires ErrorProvider', () => {
  checkProvider(useError, ErrorProvider, { loading: false }, 'Missing <ErrorProvider>')
})

test('useFlow requires FlowProvider', () => {
  checkProvider(useFlow, FlowProvider, { loading: false }, 'Missing <FlowProvider>')
})

test('useSubmit requires SubmitProvider', () => {
  checkProvider(
    useSubmit,
    SubmitProvider,
    { submitting: false, onSubmit: () => undefined },
    'Missing <SubmitProvider>'
  )
})

test('useValues requires ValuesProvider', () => {
  checkProvider(useValues, ValuesProvider, new ValuesStore(), 'Missing <ValuesProvider>')
})
