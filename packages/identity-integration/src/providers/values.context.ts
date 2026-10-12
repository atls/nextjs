import type { ValuesStore } from './values.store.js'

import { createContext }    from 'react'

const Context = createContext<ValuesStore | undefined>(undefined)

const { Provider, Consumer } = Context

export const ValuesProvider = Provider
export const ValuesConsumer = Consumer
export const ValuesContext = Context
