import { UpdateRecoveryFlowBody }             from '@ory/kratos-client'
import { RecoveryFlow as KratosRecoveryFlow } from '@ory/kratos-client'
import { AxiosError }                         from 'axios'
import { PropsWithChildren }                  from 'react'
import { FC }                                 from 'react'
import { useSearchParams }                    from 'next/navigation.js'
import { useRouter }                          from 'next/navigation.js'
import { useState }                           from 'react'
import { useEffect }                          from 'react'
import { useMemo }                            from 'react'
import { useCallback }                        from 'react'
import React                                  from 'react'

import { FlowProvider }                       from '../providers/index.js'
import { ValuesProvider }                     from '../providers/index.js'
import { ValuesStore }                        from '../providers/index.js'
import { SubmitProvider }                     from '../providers/index.js'
import { useKratosClient }                    from '../providers/index.js'
import { handleFlowError }                    from './handle-errors.util.js'

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
  const { get } = useSearchParams()
  const { kratosClient, returnToSettingsUrl } = useKratosClient()

  const returnTo = get('return_to')
  const flowId = get('flow')
  const refresh = get('refresh')
  const aal = get('aal')

  useEffect(() => {
    if (flow) {
      return
    }

    if (flowId) {
      kratosClient
        .getRecoveryFlow({ id: String(flowId) }, { withCredentials: true })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'recovery', setFlow, returnToSettingsUrl, onError))
        .finally(() => setLoading(false))

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
      .catch((error: AxiosError<KratosRecoveryFlow>) => {
        if (error.response?.status === 400) {
          setFlow(error.response?.data)

          return
        }

        // eslint-disable-next-line consistent-return
        return Promise.reject(error)
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowId, router, aal, refresh, returnTo, flow, onError])

  useEffect(() => {
    if (flow) {
      values.setFromFlow(flow)
    }
  }, [values, flow])

  const onSubmit = useCallback(
    (override?: Partial<UpdateRecoveryFlowBody>) => {
      setSubmitting(true)

      const body = {
        ...(values.getValues() as UpdateRecoveryFlowBody),
        ...(override || {}),
      }

      kratosClient
        .updateRecoveryFlow(
          // @ts-ignore
          { flow: String(flow?.id), updateRecoveryFlowBody: body },
          { withCredentials: true }
        )
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'recovery', setFlow, returnToSettingsUrl))
        .catch((error: AxiosError<KratosRecoveryFlow>) => {
          if (error.response?.status === 400) {
            setFlow(error.response?.data)

            return
          }

          // eslint-disable-next-line consistent-return
          return Promise.reject(error)
        })
        .finally(() => setSubmitting(false))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, flow, values, setSubmitting]
  )

  return (
    <FlowProvider value={{ flow, loading }}>
      <ValuesProvider value={values}>
        {/* @ts-ignore Enum conflict with string */}
        <SubmitProvider value={{ submitting, onSubmit }}>{children}</SubmitProvider>
      </ValuesProvider>
    </FlowProvider>
  )
}
