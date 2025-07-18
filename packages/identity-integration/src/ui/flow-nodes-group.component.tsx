import type { UiNode }       from '@ory/kratos-client'
import type { ReactElement } from 'react'
import type { FC }           from 'react'

import type { ActualUiNode } from './ui.interfaces.js'

import { useMemo }           from 'react'

import { useFlow }           from '../providers/index.js'

export type FlowNodesGroupChildren = (node: Array<ActualUiNode>) => ReactElement

export interface FlowNodesGroupProps {
  name: string
  children: FlowNodesGroupChildren | ReactElement
}

export const FlowNodesGroup: FC<FlowNodesGroupProps> = ({ name, children }) => {
  const { flow } = useFlow()

  const nodes = useMemo(
    () => flow?.ui?.nodes?.filter((node: UiNode) => node.group === name),
    [flow, name]
  )

  if (!(nodes && nodes.length > 0)) {
    return null
  }

  if (typeof children === 'function') {
    return children(nodes as Array<ActualUiNode>)
  }

  return children
}
