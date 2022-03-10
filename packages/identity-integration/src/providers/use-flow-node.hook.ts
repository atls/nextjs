import type { UiNodeInputAttributes } from '@ory/kratos-client'
import type { UiNode }                from '@ory/kratos-client'

import { useMemo }                    from 'react'

import { useFlow }                    from './use-flow.hook'

export const useFlowNode = (name: string): UiNode | undefined => {
  const { flow } = useFlow()

  const node = useMemo(
    () =>
      flow?.ui?.nodes?.find(
        ({ attributes }) => (attributes as UiNodeInputAttributes).name === name
      ),
    [flow, name]
  )

  return node
}
