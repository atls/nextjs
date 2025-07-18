import type { ContextKratosClient } from './kratos-client.context.js'

import { useContext }               from 'react'

import { KratosClientContext }      from './kratos-client.context.js'

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
