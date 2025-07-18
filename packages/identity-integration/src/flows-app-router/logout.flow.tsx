import type { LogoutFlow as KratosLogoutFlow } from '@ory/kratos-client'
import type { AxiosError }                     from 'axios'
import type { PropsWithChildren }              from 'react'
import type { FC }                             from 'react'

import { useSearchParams }                     from 'next/navigation.js'
import { useRouter }                           from 'next/navigation.js'
import { useState }                            from 'react'
import { useEffect }                           from 'react'
import React                                   from 'react'

import { useKratosClient }                     from '../providers/index.js'

interface LogoutFlowProps {
  returnToUrl?: string
}

export const LogoutFlow: FC<PropsWithChildren<LogoutFlowProps>> = ({ children, returnToUrl }) => {
  const [logoutToken, setLogoutToken] = useState<string>('')
  const router = useRouter()
  const { kratosClient } = useKratosClient()
  const { get } = useSearchParams()

  const returnTo = get('return_to')

  useEffect(() => {
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
  }, [router])

  useEffect(() => {
    if (logoutToken) {
      kratosClient
        .updateLogoutFlow({ token: logoutToken }, { withCredentials: true })
        .then(() => router.refresh())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoutToken, router])

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}
