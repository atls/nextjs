import type { ReactElement } from 'react'
import type { FC }           from 'react'
import type { FormEvent }    from 'react'

import type { ActualUiNode } from './ui.interfaces.js'

import { useCallback }       from 'react'

import { useFlowNode }       from '../providers/index.js'
import { useValue }          from '../providers/index.js'

type OnChangeCallback = (event: FormEvent<HTMLInputElement> | string | any) => void

export interface FlowNodeProps {
  name: string
  children: (
    node: ActualUiNode,
    value: string | any,
    callback: OnChangeCallback
  ) => ReactElement<any>
}

export const FlowNode: FC<FlowNodeProps> = ({ name, children }) => {
  const node = useFlowNode(name)
  const [value, setValue] = useValue(name)

  const onChange = useCallback(
    (event: FormEvent<HTMLInputElement> | string | any) => {
      if (event && event.target) {
        setValue(event.target.value)
      } else {
        setValue(event)
      }
    },
    [setValue]
  )

  if (node && typeof children === 'function') {
    return children(node as ActualUiNode, value, onChange)
  }

  return null
}
