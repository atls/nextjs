import type { UiNode }  from '@ory/kratos-client'

import { ReactElement } from 'react'
import { FC }           from 'react'
import { useMemo }      from 'react'

import { useFlow }      from '../providers'

export type FlowNodesGroupChildren = (node: Array<UiNode>) => ReactElement<any>

export interface FlowNodesGroupProps {
  name: string
  children: ReactElement<any> | FlowNodesGroupChildren
}

export const FlowNodesGroup: FC<FlowNodesGroupProps> = ({ name, children }) => {
  const { flow } = useFlow()

  const nodes = useMemo(() => flow?.ui?.nodes?.filter((node) => node.group === name), [flow, name])

  if (!(nodes && nodes.length > 0)) {
    return null
  }

  if (typeof children === 'function') {
    return children(nodes)
  }

  return children as ReactElement<any>
}
