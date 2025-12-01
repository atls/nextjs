import type { UpdateLoginFlowBody }          from '@ory/kratos-client'
import type { LoginFlow as KratosLoginFlow } from '@ory/kratos-client'
import type { AxiosError }                   from 'axios'
import type { PropsWithChildren }            from 'react'
import type { FC }                           from 'react'

import { useSearchParams }                   from 'next/navigation.js'
import { useRouter }                         from 'next/navigation.js'
import { useState }                          from 'react'
import { useEffect }                         from 'react'
import { useMemo }                           from 'react'
import { useCallback }                       from 'react'
import React                                 from 'react'

import { FlowProvider }                      from '../providers/index.js'
import { ValuesProvider }                    from '../providers/index.js'
import { ValuesStore }                       from '../providers/index.js'
import { SubmitProvider }                    from '../providers/index.js'
import { useKratosClient }                   from '../providers/index.js'
import { handleFlowError }                   from './handle-errors.util.js'

export interface LoginFlowProps {
  onError?: (error: { id: string }) => void
  returnToUrl?: string
}

export const LoginFlow: FC<PropsWithChildren<LoginFlowProps>> = ({
  children,
  onError,
  returnToUrl,
}) => {
  const [flow, setFlow] = useState<KratosLoginFlow>()
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const values = useMemo(() => new ValuesStore(), [])
  const router = useRouter()
  const searchParams = useSearchParams()
  const { kratosClient, returnToSettingsUrl } = useKratosClient()

  const returnTo = searchParams.get('return_to')
  const flowId = searchParams.get('flow')
  const refresh = searchParams.get('refresh')
  const aal = searchParams.get('aal')

  useEffect(() => {
    if (flow) {
      return
    }

    if (flowId) {
      kratosClient
        .getLoginFlow({ id: String(flowId) }, { withCredentials: true })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'login', setFlow, returnToSettingsUrl, onError))
        .finally(() => {
          setLoading(false)
        })

      return
    }

    kratosClient
      .createBrowserLoginFlow(
        {
          refresh: Boolean(refresh),
          aal: aal ? String(aal) : undefined,
          returnTo: returnTo?.toString() ?? returnToUrl,
        },
        { withCredentials: true }
      )
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, 'login', setFlow, returnToSettingsUrl, onError))
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
    (override?: Partial<UpdateLoginFlowBody>) => {
      setSubmitting(true)

      const body = {
        ...values.getValues(),
        ...(override || {}),
      } as UpdateLoginFlowBody

      kratosClient
        .updateLoginFlow(
          { flow: String(flow?.id), updateLoginFlowBody: body },
          { withCredentials: true }
        )
        .then(() => {
          if (flow?.return_to) {
            window.location.href = flow?.return_to
          } else {
            router.push(returnToUrl ?? '/')
          }
        })
        .catch(handleFlowError(router, 'login', setFlow, returnToSettingsUrl))
        .catch(async (error: AxiosError<KratosLoginFlow>) => {
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
        {/* @ts-expect-error correct type onSubmit */}
        <SubmitProvider value={{ submitting, onSubmit }}>{children}</SubmitProvider>
      </ValuesProvider>
    </FlowProvider>
  )
}
