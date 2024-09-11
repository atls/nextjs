import { useContext }    from 'react'

import { ValuesContext } from './values.context.js'
import { ValuesStore }   from './values.store.js'

export const useValues = (): ValuesStore => {
  const values = useContext(ValuesContext)

  if (!values) {
    throw new Error('Missing <ValuesProvider>')
  }

  return values
}
