export const extractHeaders = (context, extractors) =>
  extractors.reduce((result, extractor) => {
    const headers = extractor(context) || {}

    return {
      ...result,
      ...headers,
    }
  }, {})
