import { FlowError }     from '@ory/kratos-client'

import React             from 'react'
import { AxiosError }    from 'axios'
import { FC }            from 'react'
import { useRouter }     from 'next/router'
import { useState }      from 'react'
import { useEffect }     from 'react'

import { ErrorProvider } from '../providers'
import { kratos }        from '../sdk'

export interface ErrorErrorProps {}

export const ErrorFlow: FC<ErrorErrorProps> = ({ children }) => {
  const [error, setError] = useState<FlowError>()
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  const { id } = router.query

  useEffect(() => {
    if (!router.isReady || error) {
      return
    }

    kratos
      .getFlowError({ id: String(id) })
      .then(({ data }) => {
        setError(data)
      })
      .catch((err: AxiosError) => {
        // eslint-disable-next-line default-case
        switch (err.response?.status) {
          case 404:
          case 403:
          case 410:
            return router.push('/auth/login')
        }

        return Promise.reject(err)
      })
      .finally(() => setLoading(false))
  }, [id, router, router.isReady, error])

  return <ErrorProvider value={{ error, loading }}>{children}</ErrorProvider>
}
