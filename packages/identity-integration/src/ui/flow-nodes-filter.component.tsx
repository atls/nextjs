import { ReactElement } from 'react'
import { FC }           from 'react'
import { useMemo }      from 'react'

import { ActualUiNode } from './ui.interfaces'
import { useFlow }      from '../providers'

export type FlowNodesFilterChildren = (node: Array<ActualUiNode>) => ReactElement<any>

export interface FlowNodesFilterProps {
  predicate: (node: ActualUiNode) => boolean
  children: ReactElement<any> | FlowNodesFilterChildren
}

export const FlowNodesFilter: FC<FlowNodesFilterProps> = ({ predicate, children }) => {
  const { flow } = useFlow()

  const nodes = useMemo(
    () => (flow?.ui?.nodes as Array<ActualUiNode>)?.filter(predicate),
    [flow, predicate]
  )

  if (!(nodes && nodes.length > 0)) {
    return null
  }

  if (typeof children === 'function') {
    return children(nodes as Array<ActualUiNode>)
  }

  return children as ReactElement<any>
}
