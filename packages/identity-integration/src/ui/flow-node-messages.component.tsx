import type { UiText }       from '@ory/kratos-client'

import { ReactElement }      from 'react'
import { FC }                from 'react'
import { useMemo }           from 'react'

import { localizedMessages } from '../messages'
import { useFlowNode }       from '../providers'

export interface FlowNodeMessagesProps {
  name: string
  children: (messages: UiText[], ruMessages: string[]) => ReactElement<any>
}

export const FlowNodeMessages: FC<FlowNodeMessagesProps> = ({ name, children }) => {
  const node = useFlowNode(name)
  const ruMessages = useMemo(() => (node?.messages ? localizedMessages(node.messages) : []), [node])

  if (typeof children === 'function' && node?.messages) {
    return children(node.messages, ruMessages)
  }

  return null
}
