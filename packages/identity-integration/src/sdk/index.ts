import { Configuration } from '@ory/kratos-client'
import { V0alpha2Api }   from '@ory/kratos-client'

export class KratosClient extends V0alpha2Api {
  constructor(basePath?: string) {
    if (!basePath && typeof window !== 'undefined') {
      if (window.location.hostname === 'localhost') {
        basePath = 'http://localhost:4433' // eslint-disable-line no-param-reassign
      } else if (window.location.hostname === '127.0.0.1') {
        basePath = 'http://127.0.0.1:4433' // eslint-disable-line no-param-reassign
      } else if (window.location.hostname.startsWith('accounts.')) {
        basePath = window.location.origin.replace('accounts.', 'identity.') // eslint-disable-line no-param-reassign
      }
    }

    super(
      new Configuration({
        basePath,
      })
    )
  }
}

export const kratos = new KratosClient()
