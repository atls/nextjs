/* eslint-disable default-case */

import type { UpdateVerificationFlowBody }                 from '@ory/kratos-client'
import type { VerificationFlow as KratosVerificationFlow } from '@ory/kratos-client'
import type { AxiosError }                                 from 'axios'
import type { PropsWithChildren }                          from 'react'
import type { FC }                                         from 'react'

import { useRouter }                                       from 'next/router.js'
import { useState }                                        from 'react'
import { useEffect }                                       from 'react'
import { useMemo }                                         from 'react'
import { useCallback }                                     from 'react'
import React                                               from 'react'

import { FlowProvider }                                    from '../providers/index.js'
import { ValuesProvider }                                  from '../providers/index.js'
import { ValuesStore }                                     from '../providers/index.js'
import { SubmitProvider }                                  from '../providers/index.js'
import { useKratosClient }                                 from '../providers/index.js'

export interface VerificationFlowProps {
  onError?: (error: { id: string }) => void
  returnToUrl?: string
}

export const VerificationFlow: FC<PropsWithChildren<VerificationFlowProps>> = ({
  children,
  onError,
  returnToUrl,
}) => {
  const [flow, setFlow] = useState<KratosVerificationFlow>()
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const values = useMemo(() => new ValuesStore(), [])
  const router = useRouter()
  const { kratosClient } = useKratosClient()

  const { return_to: returnTo, flow: flowId, refresh, aal } = router.query

  useEffect(() => {
    if (!router.isReady || flow) return

    if (flowId) {
      kratosClient
        .getVerificationFlow({ id: String(flowId) }, { withCredentials: true })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((error: AxiosError<KratosVerificationFlow>) => {
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

    kratosClient
      .createBrowserVerificationFlow(
        { returnTo: returnTo?.toString() ?? returnToUrl },
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        setFlow(data)
      })
      .catch((error: AxiosError<KratosVerificationFlow>) => {
        switch (error.response?.status) {
          case 400:
            return router.push('/')
        }

        throw error
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowId, router, router.isReady, aal, refresh, returnTo, flow, onError])

  useEffect(() => {
    if (flow) {
      values.setFromFlow(flow)
    }
  }, [values, flow])

  const onSubmit = useCallback(
    (override?: Partial<UpdateVerificationFlowBody>) => {
      setSubmitting(true)

      const body = {
        ...(values.getValues() as UpdateVerificationFlowBody),
        ...(override || {}),
      }

      kratosClient
        .updateVerificationFlow(
          // @ts-ignore
          { flow: String(flow?.id), updateVerificationFlowBody: body },
          {
            withCredentials: true,
          }
        )
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((error: AxiosError<KratosVerificationFlow>) => {
          switch (error.response?.status) {
            case 400:
              setFlow(error.response?.data)
              return
          }

          throw error
        })
        .finally(() => setSubmitting(false))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flow, values, setSubmitting]
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
