import type { HelmetServerState } from '@dr.pogodin/react-helmet'

import { createContext }          from 'react'

export const HelmetStateContext = createContext<((state: HelmetServerState) => void) | undefined>(
  undefined
)
