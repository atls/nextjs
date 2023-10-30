import { createContext } from 'react'

import { KratosClient }  from '../sdk'
import { kratos }        from '../sdk'

export interface ContextKratosClient {
  kratosClient?: KratosClient
  returnToSettingsUrl?: string
}

const Context = createContext<ContextKratosClient>({
  kratosClient: kratos,
  returnToSettingsUrl: '/profile/settings',
})

const { Provider, Consumer } = Context

export const KratosClientProvider = Provider
export const KratosClientConsumer = Consumer
export const KratosClientContext = Context
