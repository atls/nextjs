import { Identity }                                   from '@ory/kratos-client'
import { UpdateRegistrationFlowBody }                 from '@ory/kratos-client'
import { RegistrationFlow as KratosRegistrationFlow } from '@ory/kratos-client'
import { ContinueWith as KratosContinueWith }         from '@ory/kratos-client'
import { UiNodeInputAttributes }                      from '@ory/kratos-client'
import { AxiosError }                                 from 'axios'
import { PropsWithChildren }                          from 'react'
import { FC }                                         from 'react'
import { useSearchParams }                            from 'next/navigation'
import { useRouter }                                  from 'next/navigation'
import { useState }                                   from 'react'
import { useEffect }                                  from 'react'
import { useMemo }                                    from 'react'
import { useCallback }                                from 'react'
import React                                          from 'react'

import { FlowProvider }                               from '../providers'
import { ValuesProvider }                             from '../providers'
import { ValuesStore }                                from '../providers'
import { SubmitProvider }                             from '../providers'
import { useKratosClient }                            from '../providers'
import { handleFlowError }                            from './handle-errors.util'

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
    verifiable_address: string
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
        .getRegistrationFlow({ id: String(flowId) }, { withCredentials: true })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'registration', setFlow, returnToSettingsUrl, onError))
        .finally(() => setLoading(false))

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
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowId, router, aal, refresh, returnTo, flow, onError])

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
        ...(values.getValues() as UpdateRegistrationFlowBody),
        ...(submitNode
          ? {
              [(submitNode.attributes as UiNodeInputAttributes).name]: (
                submitNode.attributes as UiNodeInputAttributes
              ).value,
            }
          : {}),
        ...(override || {}),
      }

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
                params.set('email', email)
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
        .catch((error: AxiosError<KratosRegistrationFlow>) => {
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
    <FlowProvider value={{ flow, loading, identity, isValid }}>
      <ValuesProvider value={values}>
        <SubmitProvider value={{ submitting, onSubmit }}>{children}</SubmitProvider>
      </ValuesProvider>
    </FlowProvider>
  )
}
