import { ReactElement } from 'react'
import { FC }           from 'react'

import { Body }         from '../providers'
import { useSubmit }    from '../providers'

export interface FlowSubmitProps {
  children: (submit: {
    onSubmit: (override?: Partial<Body>) => void
    submitting: boolean
  }) => ReactElement<any>
  method?: string
}

export const FlowSubmit: FC<FlowSubmitProps> = ({ method, children }) => {
  const { submitting, onSubmit } = useSubmit()

  if (typeof children === 'function') {
    return children({
      submitting,
      onSubmit: (override?: Partial<Body>) => onSubmit(method, override),
    })
  }

  return null
}
