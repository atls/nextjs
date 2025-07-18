import type { RegistrationFlow }           from '@ory/kratos-client'
import type { VerificationFlow }           from '@ory/kratos-client'
import type { RecoveryFlow }               from '@ory/kratos-client'
import type { SettingsFlow }               from '@ory/kratos-client'
import type { LoginFlow }                  from '@ory/kratos-client'
import type { UpdateRegistrationFlowBody } from '@ory/kratos-client'
import type { UpdateVerificationFlowBody } from '@ory/kratos-client'
import type { UpdateRecoveryFlowBody }     from '@ory/kratos-client'
import type { UpdateSettingsFlowBody }     from '@ory/kratos-client'
import type { UpdateLoginFlowBody }        from '@ory/kratos-client'

export type FlowName = 'error' | 'login' | 'recovery' | 'registration' | 'settings' | 'verification'

export type Flow = LoginFlow | RecoveryFlow | RegistrationFlow | SettingsFlow | VerificationFlow

export type Body =
  | UpdateLoginFlowBody
  | UpdateRecoveryFlowBody
  | UpdateRegistrationFlowBody
  | UpdateSettingsFlowBody
  | UpdateVerificationFlowBody
