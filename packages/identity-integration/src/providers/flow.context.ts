import type { Identity } from '@ory/kratos-client'

import type { Flow }     from './flow.interfaces.js'

import { createContext } from 'react'

export interface ContextFlow {
  flow?: Flow
  loading: boolean
  identity?: Identity
  isValid?: boolean
}

const Context = createContext<ContextFlow>({ loading: false })

const { Provider, Consumer } = Context

export const FlowProvider = Provider
export const FlowConsumer = Consumer
export const FlowContext = Context
