import type { UpdateRecoveryFlowBody }             from '@ory/kratos-client'
import type { RecoveryFlow as KratosRecoveryFlow } from '@ory/kratos-client'
import type { AxiosError }                         from 'axios'
import type { PropsWithChildren }                  from 'react'
import type { FC }                                 from 'react'

import { useRouter }                               from 'next/router.js'
import { useState }                                from 'react'
import { useEffect }                               from 'react'
import { useMemo }                                 from 'react'
import { useCallback }                             from 'react'
import React                                       from 'react'

import { FlowProvider }                            from '../providers/index.js'
import { ValuesProvider }                          from '../providers/index.js'
import { ValuesStore }                             from '../providers/index.js'
import { SubmitProvider }                          from '../providers/index.js'
import { useKratosClient }                         from '../providers/index.js'
import { handleFlowError }                         from './handle-errors.util.js'

export interface RecoveryFlowProps {
  onError?: (error: { id: string }) => void
  returnToUrl?: string
}

export const RecoveryFlow: FC<PropsWithChildren<RecoveryFlowProps>> = ({
  children,
  onError,
  returnToUrl,
}) => {
  const [flow, setFlow] = useState<KratosRecoveryFlow>()
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const values = useMemo(() => new ValuesStore(), [])
  const router = useRouter()
  const { kratosClient, returnToSettingsUrl } = useKratosClient()

  const { return_to: returnTo, flow: flowId, refresh, aal } = router.query

  useEffect(() => {
    if (!router.isReady || flow) return

    if (flowId) {
      kratosClient
        .getRecoveryFlow({ id: String(flowId) }, { withCredentials: true })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'recovery', setFlow, returnToSettingsUrl, onError))
        .finally(() => {
          setLoading(false)
        })

      return
    }

    kratosClient
      .createBrowserRecoveryFlow(
        { returnTo: returnTo?.toString() ?? returnToUrl },
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, 'recovery', setFlow, returnToSettingsUrl, onError))
      .catch(async (error: AxiosError<KratosRecoveryFlow>) => {
        if (error.response?.status === 400) {
          setFlow(error.response?.data)

          return
        }

        // eslint-disable-next-line consistent-return
        return Promise.reject(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [flowId, router, router.isReady, aal, refresh, returnTo, flow, onError])

  useEffect(() => {
    if (flow) {
      values.setFromFlow(flow)
    }
  }, [values, flow])

  const onSubmit = useCallback(
    (override?: Partial<UpdateRecoveryFlowBody>) => {
      setSubmitting(true)

      const body = {
        ...values.getValues(),
        ...(override || {}),
      } as UpdateRecoveryFlowBody

      kratosClient
        .updateRecoveryFlow(
          { flow: String(flow?.id), updateRecoveryFlowBody: body },
          { withCredentials: true }
        )
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'recovery', setFlow, returnToSettingsUrl))
        .catch(async (error: AxiosError<KratosRecoveryFlow>) => {
          if (error.response?.status === 400) {
            setFlow(error.response?.data)

            return
          }

          // eslint-disable-next-line consistent-return
          return Promise.reject(error)
        })
        .finally(() => {
          setSubmitting(false)
        })
    },

    [router, flow, values, setSubmitting]
  )

  return (
    <FlowProvider value={{ flow, loading }}>
      <ValuesProvider value={values}>
        {/* @ts-expect-error Enum conflict with string */}
        <SubmitProvider value={{ submitting, onSubmit }}>{children}</SubmitProvider>
      </ValuesProvider>
    </FlowProvider>
  )
}
