import type { Identity }                                   from '@ory/kratos-client'
import type { UpdateRegistrationFlowBody }                 from '@ory/kratos-client'
import type { RegistrationFlow as KratosRegistrationFlow } from '@ory/kratos-client'
import type { ContinueWith as KratosContinueWith }         from '@ory/kratos-client'
import type { UiNodeInputAttributes }                      from '@ory/kratos-client'
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
import { handleFlowError }                                 from './handle-errors.util.js'

export interface RegistrationFlowProps {
  onError?: (error: { id: string }) => void
  returnToUrl?: string
  shouldRedirect?: boolean
  passEmail: boolean
}

type ContinueWith = KratosContinueWith & {
  flow?: {
    id: string
    url?: string
    verifiable_address?: string
  }
}

export const RegistrationFlow: FC<PropsWithChildren<RegistrationFlowProps>> = ({
  children,
  onError,
  returnToUrl,
  shouldRedirect = true,
  passEmail = false,
}) => {
  const [flow, setFlow] = useState<KratosRegistrationFlow>()
  const [identity, setIdentity] = useState<Identity>()
  const [isValid, setIsValid] = useState<boolean>(false)
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
        .getRegistrationFlow({ id: String(flowId) }, { withCredentials: true })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'registration', setFlow, returnToSettingsUrl, onError))
        .finally(() => {
          setLoading(false)
        })

      return
    }

    kratosClient
      .createBrowserRegistrationFlow(
        { returnTo: shouldRedirect ? (returnTo?.toString() ?? returnToUrl) : undefined },
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, 'registration', setFlow, returnToSettingsUrl, onError))
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
    (override?: Partial<UpdateRegistrationFlowBody>) => {
      setSubmitting(true)

      const [submitNode] = [
        flow?.ui.nodes.filter(
          ({ attributes, group }) =>
            group === 'password' && (attributes as UiNodeInputAttributes).type === 'submit'
        ),
        flow?.ui.nodes.filter(
          ({ attributes }) => (attributes as UiNodeInputAttributes).type === 'submit'
        ),
      ].flat()

      const body = {
        ...values.getValues(),
        ...(submitNode
          ? {
              [(submitNode.attributes as UiNodeInputAttributes).name]: (
                submitNode.attributes as UiNodeInputAttributes
              ).value,
            }
          : {}),
        ...(override || {}),
      } as UpdateRegistrationFlowBody

      kratosClient
        .updateRegistrationFlow(
          { flow: String(flow?.id), updateRegistrationFlowBody: body },
          { withCredentials: true }
        )
        .then(async ({ data }) => {
          setIdentity(data.identity)
          setIsValid(true)

          const continueWithAction: ContinueWith | undefined = data.continue_with?.find(
            (action) => action.action === 'show_verification_ui'
          )

          if (flow?.return_to) {
            window.location.href = flow?.return_to
          } else if (shouldRedirect) {
            if (returnToUrl) {
              router.push(returnToUrl)
            }
            if (continueWithAction?.flow?.url) {
              if (passEmail) {
                const url = new URL(continueWithAction.flow.url)
                const params = url.searchParams
                const email = continueWithAction.flow.verifiable_address
                if (email) params.set('email', email)

                const newUrlString = `${url.origin}${url.pathname}?${params.toString()}`
                router.push(newUrlString)
              } else {
                router.push(continueWithAction.flow.url)
              }
            } else {
              router.push('/')
            }
          }
        })
        .catch(handleFlowError(router, 'registration', setFlow, returnToSettingsUrl))
        .catch(async (error: AxiosError<KratosRegistrationFlow>) => {
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
    <FlowProvider value={{ flow, loading, identity, isValid }}>
      <ValuesProvider value={values}>
        {/* @ts-expect-error correct onSubmit type */}
        <SubmitProvider value={{ submitting, onSubmit }}>{children}</SubmitProvider>
      </ValuesProvider>
    </FlowProvider>
  )
}
