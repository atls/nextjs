import type { ContextError } from './error.context.js'

import { useContext }        from 'react'

import { ErrorContext }      from './error.context.js'

export const useError = (): ContextError => {
  const error = useContext(ErrorContext)

  if (!error) {
    throw new Error('Missing <ErrorProvider>')
  }

  return error
}
