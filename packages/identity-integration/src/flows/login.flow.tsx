import { SelfServiceLoginFlow } from '@ory/kratos-client'

import React                    from 'react'
import { FC }                   from 'react'
import { useRouter }            from 'next/router'
import { useState }             from 'react'
import { useEffect }            from 'react'
import { useMemo }              from 'react'

import { FlowProvider }         from '../providers'
import { ValuesProvider }       from '../providers'
import { ValuesStore }          from '../providers'
import { kratos }               from '../sdk'
import { handleFlowError }      from './handle-errors.util'

export interface LoginFlowProps {
  onError?: (error: { id: string }) => void
}

export const LoginFlow: FC<LoginFlowProps> = ({ children, onError }) => {
  const [flow, setFlow] = useState<SelfServiceLoginFlow>()
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
        .getSelfServiceLoginFlow(String(flowId))
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
        returnTo ? String(returnTo) : undefined
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

  return (
    <FlowProvider value={{ flow, loading }}>
      <ValuesProvider value={values}>{children}</ValuesProvider>
    </FlowProvider>
  )
}
