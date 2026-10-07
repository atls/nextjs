import { Configuration } from '@ory/kratos-client'
import { FrontendApi }   from '@ory/kratos-client'
import { getDomain }     from 'tldjs'

export class KratosClient extends FrontendApi {
  constructor({ basePath, ...props }: Partial<Configuration>) {
    if (!basePath && typeof window !== 'undefined') {
      const { hostname, protocol } = window.location

      if (hostname === 'localhost') {
        basePath = 'http://localhost:4433'
      } else if (hostname === '127.0.0.1') {
        basePath = 'http://127.0.0.1:4433'
      } else if (hostname.startsWith('accounts.')) {
        basePath = origin.replace('accounts.', 'identity.')
      } else {
        basePath = `${protocol}//identity.${getDomain(hostname)}`
      }
    }

    super(new Configuration({ basePath, ...props }))
  }
}

export const kratos = new KratosClient({})
