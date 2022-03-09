import type { UiNodeInputAttributes } from '@ory/kratos-client'
import type { UiNode }                from '@ory/kratos-client'

import { ReactElement }               from 'react'
import { FC }                         from 'react'
import { useMemo }                    from 'react'

import { useFlow }                    from '../providers'

export interface FlowNodeProps {
  name: string
  children: (node: UiNode) => ReactElement<any>
}

export const FlowNode: FC<FlowNodeProps> = ({ name, children }) => {
  const { flow } = useFlow()

  const node = useMemo(
    () =>
      flow?.ui?.nodes?.find(
        ({ attributes }) => (attributes as UiNodeInputAttributes).name === name
      ),
    [flow, name]
  )

  if (node && typeof children === 'function') {
    return children(node)
  }

  return null
}
