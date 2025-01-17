import type { UiNodeInputAttributes } from '@ory/kratos-client'

import type { Flow }                  from './flow.interfaces.js'
import type { Body }                  from './flow.interfaces.js'

import { isUiNodeInputAttributes }    from '@ory/integrations/ui'
import { EventEmitter }               from 'events'

export class ValuesStore extends EventEmitter {
  #values: Body = {} as Body

  constructor() {
    super()

    this.setMaxListeners(50)
  }

  getValue(name: string): string | any {
    // @ts-ignore
    return this.#values[name]
  }

  getValues() {
    return this.#values
  }

  setValue(name: string, value: string) {
    // @ts-ignore
    this.#values[name] = value
    this.emit(name, value)
  }

  setFromFlow(flow: Flow) {
    flow?.ui?.nodes?.forEach(({ attributes }) => {
      const { name, type, value = '' } = attributes as UiNodeInputAttributes

      if (isUiNodeInputAttributes(attributes as any)) {
        if (type !== 'button' && type !== 'submit') {
          // @ts-ignore
          if (!this.#values[name]) {
            // @ts-ignore
            this.#values[name] = value
            this.emit(name, value)
          }
        }
      }
    })
  }
}
