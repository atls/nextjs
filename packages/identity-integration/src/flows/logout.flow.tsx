import { LogoutFlow as KratosLogoutFlow } from '@ory/kratos-client'

import React                              from 'react'
import { AxiosError }                     from 'axios'
import { PropsWithChildren }              from 'react'
import { FC }                             from 'react'
import { useRouter }                      from 'next/router'
import { useState }                       from 'react'
import { useEffect }                      from 'react'

import { useKratosClient }                from '../providers'

interface LogoutFlowProps {
  returnToUrl?: string
}

export const LogoutFlow: FC<PropsWithChildren<LogoutFlowProps>> = ({ children, returnToUrl }) => {
  const [logoutToken, setLogoutToken] = useState<string>('')
  const router = useRouter()
  const { kratosClient } = useKratosClient()

  const { return_to: returnTo } = router.query

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    kratosClient
      .createBrowserLogoutFlow(
        { returnTo: returnTo?.toString() ?? returnToUrl },
        { withCredentials: true }
      )
      .then(({ data }) => {
        setLogoutToken(data.logout_token)
      })
      .catch((error: AxiosError<KratosLogoutFlow>) => {
        // eslint-disable-next-line default-case
        switch (error.response?.status) {
          case 401:
            return router.push('/auth/login')
        }

        return Promise.reject(error)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, router.isReady])

  useEffect(() => {
    if (logoutToken) {
      kratosClient
        .updateLogoutFlow({ token: logoutToken }, { withCredentials: true })
        .then(() => router.reload())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoutToken, router])

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}
