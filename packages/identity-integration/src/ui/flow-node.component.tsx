import type { UiNode }                 from '@ory/kratos-client'
import type { UiNodeAnchorAttributes } from '@ory/kratos-client'

import { ReactElement }                from 'react'
import { FC }                          from 'react'
import { FormEvent }                   from 'react'
import { useCallback }                 from 'react'

import { useFlowNode }                 from '../providers'
import { useValue }                    from '../providers'

type OnChangeCallback = (event: FormEvent<HTMLInputElement> | string | any) => void
type ActualUiNode = Omit<UiNode, 'attributes'> & {
  attributes: Exclude<UiNode['attributes'], UiNodeAnchorAttributes>
}

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
