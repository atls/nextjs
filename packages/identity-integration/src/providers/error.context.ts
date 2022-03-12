import { SelfServiceError } from '@ory/kratos-client'

import { createContext }    from 'react'

export interface ContextError {
  error?: SelfServiceError
  loading: boolean
}

const Context = createContext<ContextError>({ loading: false })

const { Provider, Consumer } = Context

export const ErrorProvider = Provider
export const ErrorConsumer = Consumer
export const ErrorContext = Context
