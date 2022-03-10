import { ReactElement } from 'react'
import { FC }           from 'react'

import { useSubmit }    from '../providers'

export interface FlowSubmitProps {
  children: (submit: {
    onSubmit: (method?: string) => void
    submitting: boolean
  }) => ReactElement<any>
  method?: string
}

export const FlowSubmit: FC<FlowSubmitProps> = ({ method, children }) => {
  const { submitting, onSubmit } = useSubmit()

  if (typeof children === 'function') {
    return children({
      submitting,
      onSubmit: () => onSubmit(method),
    })
  }

  return null
}
