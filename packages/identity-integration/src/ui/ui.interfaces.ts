import type { UiNode }                from '@ory/kratos-client'
import type { UiNodeInputAttributes } from '@ory/kratos-client'
import type { UiNodeTextAttributes }  from '@ory/kratos-client'
import type { FlowError }             from '@ory/kratos-client'

export type ActualUiNode = Omit<UiNode, 'attributes'> & {
  attributes: UiNodeInputAttributes & UiNodeTextAttributes
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActualFlowError = Omit<FlowError, 'error'> & { error: any }
