import type { UiText }       from '@ory/kratos-client'
import type { ReactElement } from 'react'
import type { FC }           from 'react'

import { useMemo }           from 'react'

import { localizedMessages } from '../messages/index.js'
import { useFlowNode }       from '../providers/index.js'

export interface FlowNodeMessagesProps {
  name: string
  children: (messages: Array<UiText>, ruMessages: Array<string>) => ReactElement
}

export const FlowNodeMessages: FC<FlowNodeMessagesProps> = ({ name, children }) => {
  const node = useFlowNode(name)
  const ruMessages = useMemo(() => (node?.messages ? localizedMessages(node.messages) : []), [node])

  if (typeof children === 'function' && node?.messages) {
    return children(node.messages, ruMessages)
  }

  return null
}
