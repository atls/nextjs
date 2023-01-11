import { UpdateSettingsFlowBody }             from '@ory/kratos-client'
import { SettingsFlow as KratosSettingsFlow } from '@ory/kratos-client'

import React                                  from 'react'
import { AxiosError }                         from 'axios'
import { FC }                                 from 'react'
import { useRouter }                          from 'next/router'
import { useState }                           from 'react'
import { useEffect }                          from 'react'
import { useMemo }                            from 'react'
import { useCallback }                        from 'react'

import { FlowProvider }                       from '../providers'
import { ValuesProvider }                     from '../providers'
import { ValuesStore }                        from '../providers'
import { SubmitProvider }                     from '../providers'
import { kratos }                             from '../sdk'
import { handleFlowError }                    from './handle-errors.util'

export interface SettingsFlowProps {
  onError?: (error: { id: string }) => void
}

export const SettingsFlow: FC<SettingsFlowProps> = ({ children, onError }) => {
  const [flow, setFlow] = useState<KratosSettingsFlow>()
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
        .getSettingsFlow({ id: String(flowId) }, { withCredentials: true })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'settings', setFlow, onError))
        .finally(() => setLoading(false))

      return
    }

    kratos
      .createBrowserSettingsFlow(
        { returnTo: returnTo ? String(returnTo) : undefined },
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, 'settings', setFlow, onError))
      .catch((error: AxiosError) => {
        // eslint-disable-next-line default-case
        switch (error.response?.status) {
          case 401:
            return router.push('/auth/login')
        }

        return Promise.reject(error)
      })
      .finally(() => setLoading(false))
  }, [flowId, router, router.isReady, aal, refresh, returnTo, flow, onError])

  useEffect(() => {
    if (flow) {
      values.setFromFlow(flow)
    }
  }, [values, flow])

  const onSubmit = useCallback(
    (override?: Partial<UpdateSettingsFlowBody>) => {
      setSubmitting(true)

      const body = {
        ...(values.getValues() as UpdateSettingsFlowBody),
        ...(override || {}),
      }

      kratos
        .updateSettingsFlow(
          { flow: String(flow?.id), updateSettingsFlowBody: body },
          { withCredentials: true }
        )
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'settings', setFlow))
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
