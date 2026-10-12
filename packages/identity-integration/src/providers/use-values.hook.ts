import type { ValuesStore } from './values.store.js'

import { useContext }       from 'react'

import { ValuesContext }    from './values.context.js'

export const useValues = (): ValuesStore => {
  const values = useContext(ValuesContext)

  if (!values) {
    throw new Error('Missing <ValuesProvider>')
  }

  return values
}
