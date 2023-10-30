import { FlowError }         from '@ory/kratos-client'

import React                 from 'react'
import { AxiosError }        from 'axios'
import { PropsWithChildren } from 'react'
import { FC }                from 'react'
import { useRouter }         from 'next/router'
import { useState }          from 'react'
import { useEffect }         from 'react'

import { ErrorProvider }     from '../providers'
import { useKratosClient }   from '../providers'

export interface ErrorErrorProps {
  returnToUrl?: string
}

export const ErrorFlow: FC<PropsWithChildren<ErrorErrorProps>> = ({ children, returnToUrl }) => {
  const [error, setError] = useState<FlowError>()
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  const { kratosClient } = useKratosClient()

  const { id } = router.query

  useEffect(() => {
    if (!router.isReady || error) {
      return
    }

    kratosClient
      .getFlowError({ id: String(id) })
      .then(({ data }) => {
        setError(data)
      })
      .catch((err: AxiosError<FlowError>) => {
        // eslint-disable-next-line default-case
        switch (err.response?.status) {
          case 404:
          case 403:
          case 410:
            return router.push(returnToUrl ?? '/auth/login')
        }

        return Promise.reject(err)
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router, router.isReady, error])

  return <ErrorProvider value={{ error, loading }}>{children}</ErrorProvider>
}
