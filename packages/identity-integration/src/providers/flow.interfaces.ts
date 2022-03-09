import type { SelfServiceRegistrationFlow }           from '@ory/kratos-client'
import type { SelfServiceVerificationFlow }           from '@ory/kratos-client'
import type { SelfServiceRecoveryFlow }               from '@ory/kratos-client'
import type { SelfServiceSettingsFlow }               from '@ory/kratos-client'
import type { SelfServiceLoginFlow }                  from '@ory/kratos-client'
import type { SubmitSelfServiceRegistrationFlowBody } from '@ory/kratos-client'
import type { SubmitSelfServiceVerificationFlowBody } from '@ory/kratos-client'
import type { SubmitSelfServiceRecoveryFlowBody }     from '@ory/kratos-client'
import type { SubmitSelfServiceSettingsFlowBody }     from '@ory/kratos-client'
import type { SubmitSelfServiceLoginFlowBody }        from '@ory/kratos-client'

export type FlowName =
  | 'login'
  | 'registration'
  | 'recovery'
  | 'settings'
  | 'verification'
  | 'errors'

export type Flow =
  | SelfServiceRegistrationFlow
  | SelfServiceVerificationFlow
  | SelfServiceRecoveryFlow
  | SelfServiceSettingsFlow
  | SelfServiceLoginFlow

export type Body =
  | SubmitSelfServiceRegistrationFlowBody
  | SubmitSelfServiceVerificationFlowBody
  | SubmitSelfServiceRecoveryFlowBody
  | SubmitSelfServiceSettingsFlowBody
  | SubmitSelfServiceLoginFlowBody
