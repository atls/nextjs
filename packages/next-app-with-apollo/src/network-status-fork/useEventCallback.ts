import { useCallback, useLayoutEffect, useRef } from 'react'

export default function useEventCallback(fn: Function) {
  const ref = useRef<Function>(() => {
    throw new Error('Function is called before it was assigned.')
  })

  useLayoutEffect(() => {
    ref.current = fn
  })

  return useCallback((...args) => ref.current(...args), [])
}
