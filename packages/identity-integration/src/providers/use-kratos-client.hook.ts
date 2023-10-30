import { useContext }          from 'react'

import { ContextKratosClient } from './kratos-client.context'
import { KratosClientContext } from './kratos-client.context'

export const useKratosClient = (): Required<ContextKratosClient> => {
  const { kratosClient, returnToSettingsUrl } = useContext(KratosClientContext)

  if (!kratosClient) {
    throw new Error('Missing <KratosClientProvider>')
  }

  if (!returnToSettingsUrl) {
    throw new Error('Missing returnToSettingsUrl')
  }

  return { kratosClient, returnToSettingsUrl }
}
