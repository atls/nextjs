import type { UiText }       from '@ory/kratos-client'
import type { ReactElement } from 'react'
import type { FC }           from 'react'

import { useMemo }           from 'react'

import { localizedMessages } from '../messages/index.js'
import { useFlow }           from '../providers/index.js'

export interface FlowMessagesProps {
  children: (messages: UiText[], ruMessages: string[]) => ReactElement<any>
}

export const FlowMessages: FC<FlowMessagesProps> = ({ children }) => {
  const { flow } = useFlow()
  const messages = useMemo(() => flow?.ui?.messages || [], [flow])
  const ruMessages = useMemo(() => localizedMessages(messages) || [], [messages])

  if (typeof children === 'function' && messages) {
    return children(messages, ruMessages)
  }

  return null
}
