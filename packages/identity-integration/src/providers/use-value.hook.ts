import { useState }    from 'react'
import { useEffect }   from 'react'
import { useCallback } from 'react'

import { useValues }   from './use-values.hook.js'

export const useValue = (name: string): [string, (val: string) => void] => {
  const values = useValues()

  const [value, setValue] = useState(values.getValue(name))

  useEffect(() => {
    values.on(name, setValue)

    return (): void => {
      values.off(name, setValue)
    }
  }, [values, name])

  const onChange = useCallback(
    (val: string): void => {
      values.setValue(name, val)
    },
    [values, name]
  )

  return [value, onChange]
}
