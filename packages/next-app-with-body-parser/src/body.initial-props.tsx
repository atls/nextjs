import getRawBody from 'raw-body'
import { parse }  from 'content-type'
import { decode } from 'querystring'

export interface BodyPageProps {
  [key: string]: any
}

const getBodyInitialProps = async ({ ctx }): Promise<BodyPageProps> => {
  const { type, parameters } = parse(ctx.req.headers['content-type'] || 'text/plain')

  const encoding = parameters.charset || 'utf-8'
  const limit = '1mb'

  try {
    const buffer = await getRawBody(ctx.req, { encoding, limit })

    const body = buffer.toString()

    if (type === 'application/json' || type === 'application/ld+json') {
      return JSON.parse(body)
    }

    if (type === 'application/x-www-form-urlencoded') {
      return decode(body)
    }

    return {}
  } catch (error) {
    return {}
  }
}

export { getBodyInitialProps }
