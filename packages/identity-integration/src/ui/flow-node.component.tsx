import type { ReactElement } from 'react'
import type { FC }           from 'react'
import type { ChangeEvent }  from 'react'

import type { ActualUiNode } from './ui.interfaces.js'

import { useCallback }       from 'react'

import { useFlowNode }       from '../providers/index.js'
import { useValue }          from '../providers/index.js'

type OnChangeCallback = (event: ChangeEvent<HTMLInputElement> | string) => void

export interface FlowNodeProps {
  name: string
  children: (node: ActualUiNode, value: string, callback: OnChangeCallback) => ReactElement
}

export const FlowNode: FC<FlowNodeProps> = ({ name, children }) => {
  const node = useFlowNode(name)
  const [value, setValue] = useValue(name)

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement> | string) => {
      if (typeof event === 'string') {
        setValue(event)
      } else if (event?.target) {
        setValue(event.target.value)
      } else {
        setValue(event as never as string)
      }
    },
    [setValue]
  )

  if (node && typeof children === 'function') {
    return children(node as ActualUiNode, value, onChange)
  }

  return null
}
