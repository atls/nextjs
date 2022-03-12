import { SubmitSelfServiceLoginFlowBody } from '@ory/kratos-client'
import { SelfServiceLoginFlow }           from '@ory/kratos-client'

import React                              from 'react'
import { AxiosError }                     from 'axios'
import { FC }                             from 'react'
import { useRouter }                      from 'next/router'
import { useState }                       from 'react'
import { useEffect }                      from 'react'
import { useMemo }                        from 'react'
import { useCallback }                    from 'react'

import { FlowProvider }                   from '../providers'
import { ValuesProvider }                 from '../providers'
import { ValuesStore }                    from '../providers'
import { SubmitProvider }                 from '../providers'
import { kratos }                         from '../sdk'
import { handleFlowError }                from './handle-errors.util'

export interface LoginFlowProps {
  onError?: (error: { id: string }) => void
}

export const LoginFlow: FC<LoginFlowProps> = ({ children, onError }) => {
  const [flow, setFlow] = useState<SelfServiceLoginFlow>()
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
        .getSelfServiceLoginFlow(String(flowId), undefined, { withCredentials: true })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'login', setFlow, onError))
        .finally(() => setLoading(false))

      return
    }

    kratos
      .initializeSelfServiceLoginFlowForBrowsers(
        Boolean(refresh),
        aal ? String(aal) : undefined,
        returnTo ? String(returnTo) : undefined,
        { withCredentials: true }
      )
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, 'login', setFlow, onError))
      .finally(() => setLoading(false))
  }, [flowId, router, router.isReady, aal, refresh, returnTo, flow, onError])

  useEffect(() => {
    if (flow) {
      values.setFromFlow(flow)
    }
  }, [values, flow])

  const onSubmit = useCallback(
    (override?: Partial<SubmitSelfServiceLoginFlowBody>) => {
      setSubmitting(true)

      const body = {
        ...(values.getValues() as SubmitSelfServiceLoginFlowBody),
        ...(override || {}),
      }

      kratos
        .submitSelfServiceLoginFlow(String(flow?.id), undefined, body, { withCredentials: true })
        .then(() => {
          if (flow?.return_to) {
            window.location.href = flow?.return_to
          } else {
            router.push('/profile/settings').then(() => router.reload())
          }
        })
        .catch(handleFlowError(router, 'login', setFlow))
        .catch((error: AxiosError) => {
          if (error.response?.status === 400) {
            setFlow(error.response?.data)

            return
          }

          // eslint-disable-next-line consistent-return
          return Promise.reject(error)
        })
        .finally(() => setSubmitting(false))
    },
    [router, flow, values, setSubmitting]
  )

  return (
    <FlowProvider value={{ flow, loading }}>
      <ValuesProvider value={values}>
        <SubmitProvider value={{ submitting, onSubmit }}>{children}</SubmitProvider>
      </ValuesProvider>
    </FlowProvider>
  )
}
