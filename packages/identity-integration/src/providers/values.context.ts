import { createContext } from 'react'

import { ValuesStore }   from './values.store.js'

const Context = createContext<ValuesStore>(new ValuesStore())

const { Provider, Consumer } = Context

export const ValuesProvider = Provider
export const ValuesConsumer = Consumer
export const ValuesContext = Context
