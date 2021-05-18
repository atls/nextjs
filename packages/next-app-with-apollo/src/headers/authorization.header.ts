export const authorizationHeader = (context) => {
  const {
    ctx: { req },
  } = context

  if (req && req.get('authorization')) {
    return {
      authorization: req.get('authorization'),
    }
  }

  return {}
}
