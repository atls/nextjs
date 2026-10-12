import type { ReactElement } from 'react'
import type { FC }           from 'react'

import type { ActualUiNode } from './ui.interfaces.js'

import { useMemo }           from 'react'

import { useFlow }           from '../providers/index.js'

export type FlowNodesFilterChildren = (node: Array<ActualUiNode>) => ReactElement

export interface FlowNodesFilterProps {
  predicate: (node: ActualUiNode) => boolean
  children: FlowNodesFilterChildren | ReactElement
}

export const FlowNodesFilter: FC<FlowNodesFilterProps> = ({ predicate, children }) => {
  const { flow } = useFlow()

  const nodes = useMemo(
    () => (flow ? (flow.ui.nodes as Array<ActualUiNode>).filter(predicate) : undefined),
    [flow, predicate]
  )

  if (!(nodes && nodes.length > 0)) {
    return null
  }

  if (typeof children === 'function') {
    return children(nodes)
  }

  return children
}
