import { Configuration } from '@ory/kratos-client'
import { IdentityApi }   from '@ory/kratos-client'

import { getDomain }     from 'tldjs'

export class KratosAdminClient extends IdentityApi {
  constructor({ basePath, ...props }: Partial<Configuration>) {
    if (!basePath && typeof window !== 'undefined') {
      const { hostname, protocol } = window.location

      if (hostname === 'localhost') {
        basePath = 'http://localhost:4434' // eslint-disable-line no-param-reassign
      } else if (hostname === '127.0.0.1') {
        basePath = 'http://127.0.0.1:4434' // eslint-disable-line no-param-reassign
      } else if (hostname.startsWith('accounts.')) {
        basePath = origin.replace('accounts.', 'identity-admin.') // eslint-disable-line no-param-reassign
      } else {
        basePath = `${protocol}//identity-admin.${getDomain(hostname)}` // eslint-disable-line no-param-reassign
      }
    }

    super(new Configuration({ basePath, ...props }))
  }
}

export const kratosAdmin = new KratosAdminClient({})
