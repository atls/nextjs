import { SubmitSelfServiceRecoveryFlowBody } from '@ory/kratos-client'
import { SelfServiceRecoveryFlow }           from '@ory/kratos-client'

import React                                 from 'react'
import { AxiosError }                        from 'axios'
import { FC }                                from 'react'
import { useRouter }                         from 'next/router'
import { useState }                          from 'react'
import { useEffect }                         from 'react'
import { useMemo }                           from 'react'
import { useCallback }                       from 'react'

import { FlowProvider }                      from '../providers'
import { ValuesProvider }                    from '../providers'
import { ValuesStore }                       from '../providers'
import { SubmitProvider }                    from '../providers'
import { kratos }                            from '../sdk'
import { handleFlowError }                   from './handle-errors.util'

export interface RecoveryFlowProps {
  onError?: (error: { id: string }) => void
}

export const RecoveryFlow: FC<RecoveryFlowProps> = ({ children, onError }) => {
  const [flow, setFlow] = useState<SelfServiceRecoveryFlow>()
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const values = useMemo(() => new ValuesStore(), [])
  const router = useRouter()

  const { return_to: returnTo, flow: flowId, refresh, aal } = router.query

  useEffect(() => {
    if (!router.isReady || flow) {
      return
    }

    if (flowId) {
      kratos
        .getSelfServiceRecoveryFlow(String(flowId), undefined, { withCredentials: true })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'recovery', setFlow, onError))
        .finally(() => setLoading(false))

      return
    }

    kratos
      .initializeSelfServiceRecoveryFlowForBrowsers(returnTo ? String(returnTo) : undefined, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, 'recovery', setFlow, onError))
      .catch((error: AxiosError) => {
        if (error.response?.status === 400) {
          setFlow(error.response?.data)

          return
        }

        // eslint-disable-next-line consistent-return
        return Promise.reject(error)
      })
      .finally(() => setLoading(false))
  }, [flowId, router, router.isReady, aal, refresh, returnTo, flow, onError])

  useEffect(() => {
    if (flow) {
      values.setFromFlow(flow)
    }
  }, [values, flow])

  const onSubmit = useCallback(() => {
    setSubmitting(true)

    kratos
      .submitSelfServiceRecoveryFlow(
        String(flow?.id),
        undefined,
        values.getValues() as SubmitSelfServiceRecoveryFlowBody,
        { withCredentials: true }
      )
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, 'recovery', setFlow))
      .catch((error: AxiosError) => {
        if (error.response?.status === 400) {
          setFlow(error.response?.data)

          return
        }

        // eslint-disable-next-line consistent-return
        return Promise.reject(error)
      })
      .finally(() => setSubmitting(false))
  }, [router, flow, values, setSubmitting])

  return (
    <FlowProvider value={{ flow, loading }}>
      <ValuesProvider value={values}>
        <SubmitProvider value={{ submitting, onSubmit }}>{children}</SubmitProvider>
      </ValuesProvider>
    </FlowProvider>
  )
}
