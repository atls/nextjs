import type { UiNode }  from '@ory/kratos-client'

import { ReactElement } from 'react'
import { FC }           from 'react'
import { useMemo }      from 'react'

import { useFlow }      from '../providers'

export type FlowNodesFilterChildren = (node: Array<UiNode>) => ReactElement<any>

export interface FlowNodesFilterProps {
  predicate: (node: UiNode) => boolean
  children: ReactElement<any> | FlowNodesFilterChildren
}

export const FlowNodesFilter: FC<FlowNodesFilterProps> = ({ predicate, children }) => {
  const { flow } = useFlow()

  const nodes = useMemo(() => flow?.ui?.nodes?.filter(predicate), [flow, predicate])

  if (!(nodes && nodes.length > 0)) {
    return null
  }

  if (typeof children === 'function') {
    return children(nodes)
  }

  return children as ReactElement<any>
}
