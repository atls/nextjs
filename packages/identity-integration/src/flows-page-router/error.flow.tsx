import type { FlowError }         from '@ory/kratos-client'
import type { AxiosError }        from 'axios'
import type { PropsWithChildren } from 'react'
import type { FC }                from 'react'

import { useRouter }              from 'next/router.js'
import { useState }               from 'react'
import { useEffect }              from 'react'
import React                      from 'react'

import { ErrorProvider }          from '../providers/index.js'
import { useKratosClient }        from '../providers/index.js'

export interface ErrorErrorProps {
  returnToUrl?: string
}

export const ErrorFlow: FC<PropsWithChildren<ErrorErrorProps>> = ({ children, returnToUrl }) => {
  const [error, setError] = useState<FlowError>()
  const [loading, setLoading] = useState<boolean>(true)
  const { push, query, isReady } = useRouter()

  const { kratosClient } = useKratosClient()

  const { id } = query

  useEffect(() => {
    if (!isReady || error) {
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
            return push(returnToUrl ?? '/auth/login')
        }

        return Promise.reject(err)
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, push, isReady, error])

  return <ErrorProvider value={{ error, loading }}>{children}</ErrorProvider>
}
