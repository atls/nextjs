import { ReactElement }    from 'react'
import { FC }              from 'react'

import { ActualFlowError } from './ui.interfaces.js'
import { useError }        from '../providers/index.js'

export interface ErrorNodeProps {
  children: (node: ActualFlowError) => ReactElement<any>
}

export const ErrorNode: FC<ErrorNodeProps> = ({ children }) => {
  const { error } = useError()

  if (error && typeof children === 'function') {
    return children(error as ActualFlowError)
  }

  return null
}
