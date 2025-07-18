import type { ReactElement }    from 'react'
import type { FC }              from 'react'

import type { ActualFlowError } from './ui.interfaces.js'

import { useError }             from '../providers/index.js'

export interface ErrorNodeProps {
  children: (node: ActualFlowError) => ReactElement
}

export const ErrorNode: FC<ErrorNodeProps> = ({ children }) => {
  const { error } = useError()

  if (error && typeof children === 'function') {
    return children(error as ActualFlowError)
  }

  return null
}
