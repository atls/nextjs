/* eslint-disable default-case */

import { SubmitSelfServiceVerificationFlowBody } from '@ory/kratos-client'
import { SelfServiceVerificationFlow }           from '@ory/kratos-client'

import React                                     from 'react'
import { AxiosError }                            from 'axios'
import { FC }                                    from 'react'
import { useRouter }                             from 'next/router'
import { useState }                              from 'react'
import { useEffect }                             from 'react'
import { useMemo }                               from 'react'
import { useCallback }                           from 'react'

import { FlowProvider }                          from '../providers'
import { ValuesProvider }                        from '../providers'
import { ValuesStore }                           from '../providers'
import { SubmitProvider }                        from '../providers'
import { kratos }                                from '../sdk'

export interface VerificationFlowProps {
  onError?: (error: { id: string }) => void
}

export const VerificationFlow: FC<VerificationFlowProps> = ({ children, onError }) => {
  const [flow, setFlow] = useState<SelfServiceVerificationFlow>()
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
        .getSelfServiceVerificationFlow(String(flowId), undefined, { withCredentials: true })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((error: AxiosError) => {
          switch (error.response?.status) {
            case 410:
            case 403:
              return router.push('/auth/verification')
          }

          throw error
        })
        .finally(() => setLoading(false))

      return
    }

    kratos
      .initializeSelfServiceVerificationFlowForBrowsers(returnTo ? String(returnTo) : undefined, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch((error: AxiosError) => {
        switch (error.response?.status) {
          case 400:
            return router.push('/')
        }

        throw error
      })
      .finally(() => setLoading(false))
  }, [flowId, router, router.isReady, aal, refresh, returnTo, flow, onError])

  useEffect(() => {
    if (flow) {
      values.setFromFlow(flow)
    }
  }, [values, flow])

  const onSubmit = useCallback(
    (override?: Partial<SubmitSelfServiceVerificationFlowBody>) => {
      setSubmitting(true)

      const body = {
        ...(values.getValues() as SubmitSelfServiceVerificationFlowBody),
        ...(override || {}),
      }

      kratos
        .submitSelfServiceVerificationFlow(String(flow?.id), undefined, body, {
          withCredentials: true,
        })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((error: AxiosError) => {
          switch (error.response?.status) {
            case 400:
              setFlow(error.response?.data)
              return
          }

          throw error
        })
        .finally(() => setSubmitting(false))
    },
    [flow, values, setSubmitting]
  )

  return (
    <FlowProvider value={{ flow, loading }}>
      <ValuesProvider value={values}>
        <SubmitProvider value={{ submitting, onSubmit }}>{children}</SubmitProvider>
      </ValuesProvider>
    </FlowProvider>
  )
}
