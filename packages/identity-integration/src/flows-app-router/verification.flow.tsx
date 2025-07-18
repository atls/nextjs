/* eslint-disable default-case */

import type { UpdateVerificationFlowBody }                 from '@ory/kratos-client'
import type { VerificationFlow as KratosVerificationFlow } from '@ory/kratos-client'
import type { AxiosError }                                 from 'axios'
import type { PropsWithChildren }                          from 'react'
import type { FC }                                         from 'react'

import { useSearchParams }                                 from 'next/navigation.js'
import { useRouter }                                       from 'next/navigation.js'
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
  const { get } = useSearchParams()

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
        .getVerificationFlow({ id: String(flowId) }, { withCredentials: true })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((error: AxiosError<KratosVerificationFlow>) => {
          switch (error.response?.status) {
            case 410:
            case 403: {
              router.push('/auth/verification')
              return
            }
          }

          throw error
        })
        .finally(() => {
          setLoading(false)
        })

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
          case 400: {
            router.push('/')
            return
          }
        }

        throw error
      })
      .finally(() => {
        setLoading(false)
      })
  }, [flowId, router, aal, refresh, returnTo, flow, onError])

  useEffect(() => {
    if (flow) {
      values.setFromFlow(flow)
    }
  }, [values, flow])

  const onSubmit = useCallback(
    (override?: Partial<UpdateVerificationFlowBody>) => {
      setSubmitting(true)

      const body = {
        ...values.getValues(),
        ...(override || {}),
      } as UpdateVerificationFlowBody

      kratosClient
        .updateVerificationFlow(
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
        .finally(() => {
          setSubmitting(false)
        })
    },

    [flow, values, setSubmitting]
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
