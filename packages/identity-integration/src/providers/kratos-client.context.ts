import type { KratosClient } from '../sdk/index.js'

import { createContext }     from 'react'

import { kratos }            from '../sdk/index.js'

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
